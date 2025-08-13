import * as avscAvro from "avsc";

const runAvsc = () => {
  const type = avscAvro.Type.forSchema({
    type: "record",
    name: "Pet",
    fields: [
      {
        name: "kind",
        type: { type: "enum", name: "PetKind", symbols: ["CAT", "DOG"] },
      },
      { name: "name", type: "string" },
      { name: "height", type: "float" },
      { name: "length", type: "double" },
    ],
  });

  const buf = type.toBuffer({
    kind: "CAT",
    name: "Albert",
    height: 123.45,
    length: 123.45,
  }); // Encoded buffer.


  const obj = type.fromBuffer(buf); // = {kind: 'CAT', name: 'Albert'}

  console.log(`height: ${obj.height}, length: ${obj.length}`);
};

runAvsc();
