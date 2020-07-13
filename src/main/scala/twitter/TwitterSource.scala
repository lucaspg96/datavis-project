package twitter

import akka.NotUsed
import akka.actor.ActorSystem
import akka.stream.alpakka.mongodb.javadsl.MongoFlow
import akka.stream.scaladsl.{Keep, Sink, Source}
import akka.stream.{ActorMaterializer, OverflowStrategy}
import helper.FlowHelper
import helper.FlowHelper.mongoInsertionFlow
import models.Tweet
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

  def createSource(hashTag: String)
                  (implicit system: ActorSystem):(Source[Tweet, NotUsed], () => Unit) = createSource(Some(hashTag))

  def createSource(hashTag: Option[String] = None)
                  (implicit system: ActorSystem): (Source[Tweet, NotUsed], () => Unit) = {
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

    hashTag match {
      case Some(tag) => stream.filter(tag)
      case None => stream.sample()
    }


    log.info(s"Iniciando stream geolocalizada para hashtags ${hashTag}")

    val src = Source
      .fromPublisher(publisher)
      .map(status => Tweet(status, hashTag.getOrElse("")))
      .via(FlowHelper.mongoInsertionFlow)

    (src, stream.shutdown)
  }

  def main(args: Array[String]): Unit = {
    implicit val system = ActorSystem("twitter-source-test")
    implicit val materializer = ActorMaterializer()
    createSource()._1.runWith(Sink.foreach(println))
  }

}
