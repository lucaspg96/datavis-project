name := "twitter-streaming"

version := "0.1"

scalaVersion := "2.13.1"

libraryDependencies += "com.typesafe.akka" %% "akka-stream" % "2.6.1"
libraryDependencies += "org.twitter4j" % "twitter4j-core" % "4.0.7"
libraryDependencies += "org.twitter4j" % "twitter4j-stream" % "4.0.7"
libraryDependencies += "org.twitter4j" % "twitter4j-async" % "4.0.7"
libraryDependencies += "com.typesafe.play" %% "play-json" % "2.8.1"
libraryDependencies += "com.typesafe.akka" %% "akka-http" % "10.1.11"
libraryDependencies += "com.lightbend.akka" %% "akka-stream-alpakka-mongodb" % "2.0.1"
libraryDependencies += "org.mongodb.scala" %% "mongo-scala-driver" % "2.9.0"

mainClass in (Compile, run) := Some("Server")

