import actor.APIActor
import akka.actor.ActorSystem

object Server extends App {

  val system = ActorSystem("Twitter-streamer")
  system.actorOf(APIActor.props)

}
