package twitter

import akka.NotUsed
import akka.actor.ActorSystem
import akka.stream.scaladsl.{Keep, Sink, Source}
import akka.stream.{ActorMaterializer, OverflowStrategy}
import twitter4j.conf.ConfigurationBuilder
import twitter4j.{FilterQuery, Logger, Query, Status, StatusAdapter, TwitterStreamFactory}

object TwitterSource {

  private val log = Logger.getLogger(this.getClass)

  private val config = new ConfigurationBuilder()
    .setDebugEnabled(true)
    .setOAuthConsumerKey(TwitterAuthConfig.consumerKey)
    .setOAuthConsumerSecret(TwitterAuthConfig.consumerSecret)
    .setOAuthAccessToken(TwitterAuthConfig.accessToken)
    .setOAuthAccessTokenSecret(TwitterAuthConfig.accessTokenSecret)
    .build()

  def createSource(hashTags: String*)
                  (implicit system: ActorSystem): (Source[Status, NotUsed], () => Unit) = {
    val (actorRef, publisher) = Source
      .actorRef[Status](100, OverflowStrategy.fail)
      .toMat(Sink.asPublisher(true))(Keep.both)
      .run()

    val stream = new TwitterStreamFactory(config).getInstance()

    val listener = new StatusAdapter {
      override def onStatus(status: Status): Unit = {
        actorRef ! status
      }
    }

    stream.addListener(listener)
    stream.cleanUp()

    if(hashTags.isEmpty) stream.sample()
    else {
      val query: FilterQuery = new FilterQuery()

      query.track(hashTags: _*)
      //    query.locations(Array[Double](-180, -90), Array[Double](0, 0))
      stream.filter(query)
    }


    log.info(s"Iniciando stream geolocalizada para hashtags ${hashTags.mkString("[", ")", "]")}")

    (Source.fromPublisher(publisher), stream.shutdown)
  }

  def main(args: Array[String]): Unit = {
    implicit val system = ActorSystem("twitter-source-test")
    implicit val materializer = ActorMaterializer()
    createSource()._1.runWith(Sink.foreach(println))
  }

}
