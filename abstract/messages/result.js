import factory from "./_factory";

export default factory([
    50,
    { name: "request", type: "id" },
    { name: "details", type: "dict" },
    { name: "arguments", type: "list", options: { default: [] }, },
    { name: "argumentskw", type: "dict", options: { default: {} }, },
], {
    minlength: 3,
    maxlength: 5,
});
