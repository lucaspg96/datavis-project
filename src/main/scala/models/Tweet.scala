package models

import play.api.libs.json.{Json, OFormat}
import twitter4j.Status

import scala.util.Try

case class Tweet(id: Long,
                 text: String,
                 date: String,
                 userName: String,
                 position: Option[Seq[Double]],
                 wordCount: Map[String, Int])

object Tweet {
  val format: OFormat[Tweet] = Json.format

  private def wordCount(text: String): Map[String, Int] = {
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

  def apply(status: Status): Tweet = {
    Tweet(
      status.getId,
      status.getText,
      status.getCreatedAt.toString,
      status.getUser.getName,
      Try(List(status.getGeoLocation.getLatitude, status.getGeoLocation.getLongitude)).toOption,
      wordCount(status.getText)
    )
  }
}