import factory from "./_factory";

export default factory([
    32,
    { name: "request", type: "id" },
    { name: "options", type: "dict" },
    { name: "topic", type: "uri" },
]);
