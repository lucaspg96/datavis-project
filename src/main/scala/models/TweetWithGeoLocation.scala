package models

import play.api.libs.json.{Json, OFormat}
import twitter4j.Status

import scala.util.Try

case class TweetWithGeoLocation(id: Long,
                                text: String,
                                date: String,
                                userName: String,
                                lat: Double,
                                lng: Double)

object TweetWithGeoLocation {
  val format: OFormat[TweetWithGeoLocation] = Json.format

  def apply(status: Status): Option[TweetWithGeoLocation] = {
    //TODO apagar
    Try(TweetWithGeoLocation(
      status.getId,
      status.getText,
      status.getCreatedAt.toString,
      status.getUser.getName,
      status.getGeoLocation.getLatitude,
      status.getGeoLocation.getLongitude
    )).toOption
  }
}
