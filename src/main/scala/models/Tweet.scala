package models

import play.api.libs.json.{Json, OFormat}
import twitter4j.Status

import scala.util.Try

case class Tweet(id: Long,
                 text: String,
                 date: Long,
                 key: String,
                 userName: String,
                 retweet: Boolean,
                 reply: Boolean,
                 mediasAndLink: Int,
                 mentions: Int,
                 position: Option[Seq[Double]],
                 wordCount: Map[String, Int]) {

  def isGeolocated: Boolean = position.isDefined

  def withCleanMap: Tweet = this.copy(wordCount = Map.empty)

}

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
      .map((_,1.toInt))
      .groupBy(_._1)
      .map{
        case (word, values) => (word, values.map(_._2).sum)
      }
  }

  private def getPosition(status: Status): Option[Seq[Double]] = {
    Try(List(status.getGeoLocation.getLatitude, status.getGeoLocation.getLongitude))
      .toOption match {
      case Some(pos) => Some(pos)

      case None =>
        Try{
          val boundingBox = status.getPlace.getBoundingBoxCoordinates.flatten

          val lat = boundingBox.map(_.getLatitude).sum / boundingBox.length
          val lon = boundingBox.map(_.getLongitude).sum / boundingBox.length

          List(lat, lon)
        }.toOption
    }
  }

  def apply(status: Status, key: String): Tweet = {

    Tweet(
      status.getId,
      status.getText,
      status.getCreatedAt.getTime,
      key,
      status.getUser.getName,
      status.isRetweet,
      status.getInReplyToStatusId > -1,
      status.getMediaEntities.length + status.getURLEntities.length,
      status.getUserMentionEntities.length,
      getPosition(status),
      wordCount(status.getText)
    )
  }
}