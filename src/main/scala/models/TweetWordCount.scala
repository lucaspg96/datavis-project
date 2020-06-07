package models

import play.api.libs.json.{Json, OFormat}

case class TweetWordCount(words: Map[String, Int])

object TweetWordCount {
  val format: OFormat[TweetWordCount] = Json.format
}
