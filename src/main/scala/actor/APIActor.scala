package actor

import java.io.File

import akka.actor.{Actor, ActorLogging, ActorSystem, Props}
import akka.http.scaladsl.Http
import akka.http.scaladsl.model.HttpEntity.Strict
import akka.http.scaladsl.model.HttpMethods._
import akka.http.scaladsl.model.ws.{Message, TextMessage, UpgradeToWebSocket}
import akka.http.scaladsl.model._
import akka.stream.scaladsl.{Broadcast, Flow, GraphDSL, Merge, Sink}
import akka.stream.{ActorMaterializer, FlowShape, UniformFanInShape, UniformFanOutShape}
import akka.util.ByteString
import com.typesafe.config.ConfigFactory
import helper.FlowHelper
import models.Tweet
import twitter.TwitterSource

import scala.concurrent.duration._

import scala.concurrent.{Await, ExecutionContext}
EZA
class APIActor extends Actor with ActorLogging {

  private implicit val system: ActorSystem = context.system

  import system._

  def generateTwitterDataFlow(hashTag: Option[String])
                             (implicit executionContext: ExecutionContext):Flow[Message, TextMessage, Unit] = {
    val (source, closeFunction) = TwitterSource.createSource(hashTag)

    Flow
      .fromGraph(GraphDSL.create() { implicit b =>
        import akka.stream.scaladsl.GraphDSL.Implicits._

        val in: UniformFanOutShape[Message, Message] = b.add(Broadcast(1))
        val out: UniformFanInShape[TextMessage, TextMessage] = b.add(Merge(1))

        val tweetToJsonStringFlow = Flow[Tweet]
          .map(tweet => TextMessage(Tweet.format.writes(tweet).toString()))

        in ~> Sink.ignore

        source ~> tweetToJsonStringFlow ~> out

        FlowShape(in.in, out.out)
      }).watchTermination()((_, future) => future.onComplete { _ =>
      log.info("Cliente desconectado. Encerrando stream")
      closeFunction()
    })
  }


  def requestHandler: HttpRequest => HttpResponse = {
    case req@HttpRequest(GET, Uri.Path("/tweets"), _, _, _) =>
      val hashTag = req.uri.query().get("keywords")
      req.header[UpgradeToWebSocket] match {
        case Some(upgrade) =>
          log.info(s"Novo cliente conectado. Iniciando stream...")
          upgrade
            .handleMessages(generateTwitterDataFlow(hashTag))

        case None => HttpResponse(400, entity = "Requisição websocket inválida!")
      }

    case HttpRequest(GET, Uri.Path("/historical-tweets"), _, _, _) =>

      val tweetObjects = FlowHelper
        .findAll(ActorMaterializer())
        .map(seq => seq map(Tweet.format.writes(_).toString()))

      HttpResponse(200, entity = Strict(
        ContentTypes.`application/json`,
        ByteString(Await.result(tweetObjects, 1.second).toString)
      ))

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

