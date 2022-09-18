import hello from "./hello";
import welcome from "./welcome";
import abort from "./abort";
import goodbye from "./goodbye";
import subscribed from "./subscribed";

export default {
    HELLO: hello.code,
    WELCOME: welcome.code,
    ABORT: abort.code,
    GOODBYE: goodbye.code,

    ERROR: 8,
    PUBLISH: 16, PUBLISHED: 17,
    SUBSCRIBE: 32, SUBSCRIBED: subscribed.code, UNSUBSCRIBE: 34, UNSUBSCRIBED: 35,
    EVENT: 36,

    CALL: 48, RESULT: 50,
    REGISTER: 64, REGISTERED: 65, UNREGISTER: 66, UNREGISTERED: 67,
    INVOCATION: 68, YIELD: 70,

    hello, abort, goodbye, welcome,
    subscribed,
}
