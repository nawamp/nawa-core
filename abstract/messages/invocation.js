import factory from "./_factory";

export default factory([
    68,
    { name: "request", type: "id" },
    { name: "registration", type: "id" },
    { name: "details", type: "dict" },
    { name: "arguments", type: "list" },
    { name: "argumentskw", type: "dict" },
], {
    minlength: 4,
    maxlength: 6,
});
