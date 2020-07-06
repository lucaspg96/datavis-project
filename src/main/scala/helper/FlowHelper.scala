package helper

import akka.stream.Attributes.LogLevels
import akka.stream.{Attributes, Materializer}
import akka.stream.alpakka.mongodb.scaladsl.{MongoFlow, MongoSource}
import akka.stream.scaladsl.{Flow, Sink}
import com.mongodb.reactivestreams.client.{MongoClients, MongoCollection}
import models.Tweet
import org.bson.BsonDocument
import org.bson.codecs.configuration.CodecRegistries.{fromProviders, fromRegistries}
import org.mongodb.scala.MongoClient.DEFAULT_CODEC_REGISTRY
import org.mongodb.scala.bson.codecs.Macros._
import org.mongodb.scala.bson.conversions.Bson


object FlowHelper {

  private val client = MongoClients.create("mongodb://localhost:27017")
  private val db = client.getDatabase("twitter-vis")
  private val codecRegistry = fromRegistries(fromProviders(classOf[Tweet]), DEFAULT_CODEC_REGISTRY)
  private val tweetsCollection: MongoCollection[Tweet] = db
    .getCollection("tweet", classOf[Tweet])
    .withCodecRegistry(codecRegistry)

  def mongoInsertionFlow = Flow[Tweet]
    .map(_.withCleanMap)
      .via(MongoFlow.insertOne[Tweet](tweetsCollection))
//    .log("mongo-insert")
//    .addAttributes(Attributes.logLevels(onElement = LogLevels.Info))

  def findAll(implicit m: Materializer)  =
    MongoSource(tweetsCollection.find(classOf[BsonDocument]))
//    .log("mongo-query")
//    .addAttributes(Attributes.logLevels(onElement = LogLevels.Info))
      .runWith(Sink.seq)




}
