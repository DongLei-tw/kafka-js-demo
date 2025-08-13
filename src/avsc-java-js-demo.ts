import * as avro from "avsc";
import DecimalType from './decimal-java';

// In the demo we will use the DecimalType (implemented following what the official java version) for encoding and decoding.

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

  const order = { name: "Apple", price: 12.45 };
  const buf = type.toBuffer(order);
  console.log("Encoded Buffer:", buf);

  const decoded = type.fromBuffer(buf);
  console.log("Decoded Object:", decoded);
};

runAvsc();
