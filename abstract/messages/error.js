import factory from "./_factory";

import subscribe from "./subscribe";
import unsubscribe from "./unsubscribe";
import publish from "./publish";
import register from "./register";
import unregister from "./unregister";
import call from "./call";
import invocation from "./invocation";



export default factory([
    8,
    { name: "type", type: "enum", options: {
        values: [
            subscribe.code,
            unsubscribe.code,
            publish.code,
            register.code,
            unregister.code,
            call.code,
            invocation.code,
        ],
    } },
    { name: "request", type: "id" },
    { name: "details", type: "dict" },
    { name: "error", type: "uri" },
    { name: "arguments", type: "list", options: { default: [] } },
    { name: "argumentskw", type: "dict", options: { default: {} } },
], {
    minlength: 5,
    maxlength: 7,
    strip_arguments: true,
});
