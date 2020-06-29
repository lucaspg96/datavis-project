package helper

import akka.stream.Materializer
import akka.stream.alpakka.mongodb.scaladsl.{MongoFlow, MongoSource}
import akka.stream.scaladsl.{Flow, Sink}
import com.mongodb.reactivestreams.client.{MongoClients, MongoCollection}
import models.Tweet
import org.bson.codecs.configuration.CodecRegistries.{fromProviders, fromRegistries}
import org.mongodb.scala.MongoClient.DEFAULT_CODEC_REGISTRY
import org.mongodb.scala.bson.codecs.Macros._


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

  def findAll(implicit m: Materializer)  =
    MongoSource(tweetsCollection.find(classOf[Tweet])).runWith(Sink.seq)




}
