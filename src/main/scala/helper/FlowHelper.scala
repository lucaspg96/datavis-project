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

  def getTweetsWordCountProcessingPipeline: Flow[Status, Status, NotUsed]#Repr[TweetWordCount] = {
    Flow[Status]
      .map(_.getText.toLowerCase)
      .map(wordCount)
      .map(TweetWordCount(_))
  }

  def wordCount(text: String): Map[String, Int] = {
    val undesiredChars = Array(".",",","!","'","?",":")
    //removendo caracteres indesejáveis
    undesiredChars.fold(text)((text, und) => text.replace(und, ""))
      .split(" ")
      .filterNot(word => word.startsWith("@"))
      .filterNot(word => word.forall(Character.isDigit))
      .filterNot(word => word.length < 5)
      .filterNot(word => word.startsWith("http"))
      .map((_,1))
      .groupBy(_._1)
      .map{
        case (word, values) => (word, values.map(_._2).sum)
      }
  }

}
