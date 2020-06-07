package models

import play.api.libs.json.{Json, OFormat}
import twitter4j.Status

import scala.util.Try

case class Tweet(id: Long,
                 text: String,
                 date: String,
                 userName: String,
                 position: Option[Seq[Double]])

object Tweet {
  val format: OFormat[Tweet] = Json.format

  def apply(status: Status): Tweet = {
    Tweet(
      status.getId,
      status.getText,
      status.getCreatedAt.toString,
      status.getUser.getName,
      Try(List(status.getGeoLocation.getLongitude, status.getGeoLocation.getLatitude)).toOption
    )
  }
}