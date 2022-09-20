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

import register from "./register";
import registered from "./registered";
import unregister from "./unregister";
import unregistered from "./unregistered";

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

    REGISTER: register.code, REGISTERED: registered.code,
    UNREGISTER: unregister.code, UNREGISTERED: unregistered.code,
    CALL: 48, RESULT: 50,
    INVOCATION: 68, YIELD: 70,



    hello, abort, goodbye, welcome,

    publish, published,
    subscribe, subscribed, unsubscribe, unsubscribed,
    event,

    register, registered, unregister, unregistered,
}
