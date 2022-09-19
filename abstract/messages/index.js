import hello from "./hello";
import welcome from "./welcome";
import abort from "./abort";
import goodbye from "./goodbye";

import subscribe from "./subscribe";
import subscribed from "./subscribed";
import unsubscribe from "./unsubscribe";
import unsubscribed from "./unsubscribed";
import publish from "./publish";
import published from "./published";
import event from "./event";

export default {
    HELLO: hello.code,
    WELCOME: welcome.code,
    ABORT: abort.code,
    GOODBYE: goodbye.code,

    ERROR: 8,
    PUBLISH: publish.code, PUBLISHED: published.code,
    SUBSCRIBE: subscribe.code, SUBSCRIBED: subscribed.code,
    UNSUBSCRIBE: unsubscribe.code, UNSUBSCRIBED: unsubscribed.code,
    EVENT: event.code,

    CALL: 48, RESULT: 50,
    REGISTER: 64, REGISTERED: 65, UNREGISTER: 66, UNREGISTERED: 67,
    INVOCATION: 68, YIELD: 70,



    hello, abort, goodbye, welcome,

    publish, published,
    subscribe, subscribed, unsubscribe, unsubscribed,
    event,
}
