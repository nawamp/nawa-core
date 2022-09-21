import factory from "./_factory";

export default factory([
    48,
    { name: "request", type: "id" },
    { name: "options", type: "dict" },
    { name: "procedure", type: "uri" },
    { name: "arguments", type: "list" },
    { name: "argumentskw", type: "dict" },
], {
    minlength: 4,
    maxlength: 6,
});
