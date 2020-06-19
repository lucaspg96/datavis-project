import akka.actor.ActorSystem
import akka.stream.SystemMaterializer
import akka.stream.scaladsl.Sink
import helper.FlowHelper
import models.Tweet
import twitter.TwitterSource

import scala.concurrent.duration._

object StreamTest {

  implicit val system: ActorSystem = ActorSystem()
  import system._

  def main(args: Array[String]): Unit = {
    val (source, _) = TwitterSource.createSource("covid")

    source
      .filter(_.isGeolocated)
      .map(_.text)
//      .throttle(1, 2.seconds)
      .runWith(Sink.foreach(t => println(s"-----------------\n$t\n-----------------")))
      .recover{
        case t: Throwable => t.printStackTrace()
      }
  }

}
