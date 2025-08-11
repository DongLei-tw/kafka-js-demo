// https://www.npmjs.com/package/avro-js
var avro = require("avro-js");

const run = () => {
  var type = avro.parse({
    name: "Pet",
    type: "record",
    fields: [
      {
        name: "kind",
        type: { name: "Kind", type: "enum", symbols: ["CAT", "DOG"] },
      },
      { name: "name", type: "string" },
      { name: "height", type: "float" },
      { name: "length", type: "double" },
    ],
  });

  var pet = { kind: "CAT", name: "Albert", height: 123.45, length: 123.45 };
  console.log(`raw: height:${pet.height}, length: ${pet.length} `);
  var buf = type.toBuffer(pet); // Serialized object.

  var obj = type.fromBuffer(buf);
  console.log(`height: ${obj.height}, length: ${obj.length}`);
};

run();
