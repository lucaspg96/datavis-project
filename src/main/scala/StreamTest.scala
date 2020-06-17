import akka.actor.ActorSystem
import akka.stream.SystemMaterializer
import akka.stream.scaladsl.Sink
import helper.FlowHelper
import models.Tweet
import twitter.TwitterSource

import scala.concurrent.duration._

object StreamTest {

  implicit val system: ActorSystem = ActorSystem()

  def main(args: Array[String]): Unit = {
    val (source, _) = TwitterSource.createSource("covid")

    source
      .via(FlowHelper.getGeoLocatedTweetsProcessingPipeline)
      .filter(_.isGeolocated)
      .map(_.text)
//      .throttle(1, 2.seconds)
      .runWith(Sink.foreach(t => println(s"-----------------\n$t\n-----------------")))
  }

}
