import factory from "./_factory";

export default factory([
    16,
    { name: "request", type: "id" },
    { name: "options", type: "dict" },
    { name: "topic", type: "uri" },
    { name: "arguments", type: "list" },
    { name: "argumentskw", type: "dict" },
], {
    minlength: 4,
    maxlength: 6,
});
