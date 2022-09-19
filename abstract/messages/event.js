import factory from "./_factory";

export default factory([
    36,
    { name: "subscription", type: "id" },
    { name: "publication", type: "id" },
    { name: "details", type: "dict" },
    { name: "arguments", type: "list", options: { default: [] }, },
    { name: "argumentskw", type: "dict", options: { default: {} }, },
], {
    minlength: 4,
    maxlength: 6,
});
