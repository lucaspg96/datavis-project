package actor

import java.io.File

import akka.NotUsed
import akka.actor.{Actor, ActorLogging, ActorSystem, Props}
import akka.http.scaladsl.Http
import akka.http.scaladsl.model.ws.{Message, TextMessage, UpgradeToWebSocket}
import akka.http.scaladsl.model.{ContentType, ContentTypes, HttpEntity, HttpRequest, HttpResponse, ResponseEntity, Uri}
import akka.stream.{ActorMaterializer, FlowShape, UniformFanInShape, UniformFanOutShape}
import akka.http.scaladsl.model.HttpMethods._
import akka.stream.scaladsl.{Broadcast, Flow, GraphDSL, Merge, Sink}
import com.typesafe.config.ConfigFactory
import helper.FlowHelper
import models.{Tweet, TweetWithGeoLocation, TweetWordCount}
import twitter.TwitterSource
import twitter4j.Status
import akka.http.scaladsl.server.directives._
import ContentTypeResolver.Default

import scala.concurrent.ExecutionContext
import scala.io.Source

class APIActor extends Actor with ActorLogging {

  private implicit val system: ActorSystem = context.system

  import system._

  private implicit val materializer: ActorMaterializer = ActorMaterializer()

  def generateTwitterDataFlow(preProcessingFlow: Flow[Status, Status, NotUsed]#Repr[String],
                              hashtag: Option[String])
                             (implicit executionContext: ExecutionContext) = {
    val (source, closeFunction) = TwitterSource.createSource(hashtag.fold(Nil: List[String])(List(_)):_*)

    Flow
      .fromGraph(GraphDSL.create() { implicit b =>
        import akka.stream.scaladsl.GraphDSL.Implicits._

        val in: UniformFanOutShape[Message, Message] = b.add(Broadcast(1))
        val out: UniformFanInShape[TextMessage, TextMessage] = b.add(Merge(1))

        val statusToJsonStringFlow = preProcessingFlow
          .map(value => TextMessage(value.toString))

        in ~> Sink.ignore

        source ~> statusToJsonStringFlow ~> out

        FlowShape(in.in, out.out)
      }).watchTermination()((_, future) => future.onComplete { _ =>
      log.info("Cliente desconectado. Encerrando stream")
      closeFunction()
    })
  }


  def requestHandler: HttpRequest => HttpResponse = {
    case req@HttpRequest(GET, Uri.Path("/tweets"), _, _, _) =>
      val hashtag = req.uri.query().get("hashtag")
      req.header[UpgradeToWebSocket] match {
        case Some(upgrade) =>
          log.info(s"Novo cliente conectado. Iniciando stream...")
          req.uri.query().get("geolocated") match {
            case Some("true") =>
              val processFlow = FlowHelper
                .getGeoLocatedTweetsProcessingPipeline
                .map(Tweet.format.writes(_).toString())
              upgrade
                .handleMessages(generateTwitterDataFlow(processFlow, hashtag))
            case _ =>
              val processFlow = FlowHelper
                .getTweetsWordCountProcessingPipeline
                .map(TweetWordCount.format.writes(_).toString())
              upgrade
                .handleMessages(generateTwitterDataFlow(processFlow, hashtag))
          }

        case None => HttpResponse(400, entity = "Requisição websocket inválida!")
      }

    case r: HttpRequest =>
      val path = if(r.uri.path.toString().length <= 1) "/webapp/index.html"
      else r.uri.path.toString()
      val file = new File("src/main/resources" + path)
      if (file.exists()) {
        val ct = if(path.endsWith(".html")) ContentTypes.`text/html(UTF-8)`
        else ContentTypes.NoContentType
        HttpResponse(entity = HttpEntity.fromFile(ct, file))
      } else HttpResponse(404)

  }

  private val config = ConfigFactory.load().getConfig("application.http")
  Http()(system)
    .bindAndHandleSync(requestHandler, interface = config.getString("host"), port = config.getInt("port"))

  override def receive: Receive = {
    case _ =>
  }
}

object APIActor {
  def props: Props = Props(new APIActor)
}

