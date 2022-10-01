import hello from "./hello";
import challenge from "./challenge";
import authenticate from "./authenticate";
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

import call from "./call";
import invocation from "./invocation";
import _yield from "./yield";
import result from "./result";

import error from "./error";


export default {
    HELLO: hello.code,
    CHALLENGE: challenge.code, AUTHENTICATE: authenticate.code,
    WELCOME: welcome.code,
    ABORT: abort.code,
    GOODBYE: goodbye.code,

    ERROR: error.code,
    PUBLISH: publish.code, PUBLISHED: published.code,
    SUBSCRIBE: subscribe.code, SUBSCRIBED: subscribed.code,
    UNSUBSCRIBE: unsubscribe.code, UNSUBSCRIBED: unsubscribed.code,
    EVENT: event.code,

    REGISTER: register.code, REGISTERED: registered.code,
    UNREGISTER: unregister.code, UNREGISTERED: unregistered.code,

    CALL: call.code, RESULT: result.code,
    INVOCATION: invocation.code, YIELD: _yield.code,



    hello, challenge, authenticate, abort, goodbye, welcome,

    publish, published,
    subscribe, subscribed, unsubscribe, unsubscribed,
    event,

    register, registered, unregister, unregistered,
    call, invocation, yield: _yield, result,

    error
}
