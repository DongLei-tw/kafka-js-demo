import * as avro from "avsc";
import DecimalType from "./decimal-hex"

// This is a example to understand the encode and decode more.

const runAvsc = () => {
  const type = avro.Type.forSchema(
    {
      type: "record",
      name: "Order",
      fields: [
        { name: "name", type: "string" },
        {
          name: "price",
          type: {
            type: "bytes",
            logicalType: "decimal",
            precision: 10,
            scale: 2,
          },
        },
      ],
    },
    {
      logicalTypes: { "decimal": DecimalType },
    }
  );

  // encode
  const order = { name: "Apple", price: 12.45 };
  const buf = type.toBuffer(order);
  console.log("Encoded Buffer:", buf);

  // decode
  const decoded = type.fromBuffer(buf);
  console.log("Decoded Object:", decoded);
};

runAvsc();
