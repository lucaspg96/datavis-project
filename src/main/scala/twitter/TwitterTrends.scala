package twitter

import twitter4j.{Logger, TwitterFactory}
import twitter4j.conf.ConfigurationBuilder
import scala.jdk.CollectionConverters._

object TwitterTrends {

  private val log = Logger.getLogger(this.getClass)

  private val config = new ConfigurationBuilder()
    .setDebugEnabled(true)
    .setOAuthConsumerKey(TwitterAuthConfig.consumerKey)
    .setOAuthConsumerSecret(TwitterAuthConfig.consumerSecret)
    .setOAuthAccessToken(TwitterAuthConfig.accessToken)
    .setOAuthAccessTokenSecret(TwitterAuthConfig.accessTokenSecret)
    .build()

  private val client = new TwitterFactory(config).getInstance()

  def apply() = {
    client.getPlaceTrends(1)
      .getTrends
      .map(trend => trend.getName -> trend.getTweetVolume)
      .filter(_._2 > 0)
      .sortBy(-_._2)
      .take(10)
  }

}
