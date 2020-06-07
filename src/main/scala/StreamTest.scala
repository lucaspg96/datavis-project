import akka.actor.ActorSystem
import akka.stream.SystemMaterializer
import akka.stream.scaladsl.Sink
import helper.FlowHelper
import models.Tweet
import twitter.TwitterSource

object StreamTest {

  implicit val system: ActorSystem = ActorSystem()

  def main(args: Array[String]): Unit = {
    val (source, _) = TwitterSource.createSource("#covid")

    source
      .via(FlowHelper.getGeoLocatedTweetsProcessingPipeline)
//      .map{tweet =>
//        println(tweet.text)
//        tweet
//      }
      .collect{
        case Tweet(_, tweet, _, _, Some(pos)) => pos
      }
      .runWith(Sink.foreach(println))
  }

}
