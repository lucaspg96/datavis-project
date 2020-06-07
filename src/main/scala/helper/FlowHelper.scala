package helper

import akka.NotUsed
import akka.stream.scaladsl.Flow
import models.{Tweet, TweetWithGeoLocation, TweetWordCount}
import twitter4j.Status

object FlowHelper {

  def getGeoLocatedTweetsProcessingPipeline: Flow[Status, Status, NotUsed]#Repr[Tweet] = {
    //TODO apagar
    Flow[Status]
      .map(Tweet(_))
  }



}
