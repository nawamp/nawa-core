import factory from "./_factory";

export default factory([
    70,
    { name: "request", type: "id" },
    { name: "options", type: "dict" },
    { name: "arguments", type: "list", options: { default: [] }, },
    { name: "argumentskw", type: "dict", options: { default: {} }, },
], {
    minlength: 3,
    maxlength: 5,
});
