package twitter

import com.typesafe.config.ConfigFactory

object TwitterAuthConfig {

  private val config = ConfigFactory.load().getConfig("twitter.auth")

  def consumerKey: String = config.getString("consumerKey")
  def consumerSecret: String = config.getString("consumerSecret")

  def accessToken: String = config.getString("accessToken")
  def accessTokenSecret: String = config.getString("accessTokenSecret")

}
