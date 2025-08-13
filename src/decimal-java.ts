import Decimal from "decimal.js";
import * as avro from "avsc";

/**
 * This is a self implemented version of Decimal encoding and decoding referring
 * to the Avro specification and the Java implemetation at here:
 * https://github.com/apache/avro/blob/main/lang/java/avro/src/main/java/org/apache/avro/Conversions.java#L188.
 * It's not fully tested and actively maintained.
 * We should consider the avro decode algorithm has changed if value consistency issue occurs.
 */
export default class DecimalType extends avro.types.LogicalType {
  private precision: number;
  private scale: number;

  constructor(attrs: any, opts?: any) {
    super(attrs, opts);
    this.precision = attrs.precision;
    this.scale = attrs.scale;
  }

  /**
   * Encoding: Decimal/Number => Buffer
   * Limitation: Integer absolute value <= Number.MAX_SAFE_INTEGER
   */
  _toValue(value: decimal.Decimal): Buffer {
    const decimalVal = value instanceof Decimal ? value : new Decimal(value);

    if (decimalVal.precision(true) > this.precision) {
      throw new Error(
        `Value exceeds precision ${this.precision}: ${decimalVal.toString()}`
      );
    }

    const scale = decimalVal.decimalPlaces();
    if (scale > this.scale) {
      throw new Error(
        `Value exceeds scale ${this.scale}: ${decimalVal.toString()}`
      );
    }

    // Get unscaled value as BigInt
    const unscaled = BigInt(decimalVal.times(new Decimal(10).pow(scale)).toFixed(0));
    let hex = unscaled.toString(16);

    // Handle negative numbers (two's complement)
    let byteLength = Math.ceil(hex.length / 2);
    if (unscaled < 0n) {
      // Find two's complement for negative numbers
      const bits = byteLength * 8;
      const twos = (1n << BigInt(bits)) + unscaled;
      hex = twos.toString(16);
    }

    if (hex.length % 2) hex = "0" + hex;
    const bytes = hex.match(/.{2}/g)!.map((b) => parseInt(b, 16));
    return Buffer.from(bytes);
  }

  /**
   * Decoding: Buffer => Number
   * Limitation: Return value absolute value <= Number.MAX_SAFE_INTEGER
   */
  _fromValue(value: Buffer): number {
    // Convert byte array to BigInt
    let hex = Array.from(value, (x) => x.toString(16).padStart(2, "0")).join(
      ""
    );
    // Handle negative number's two's complement
    if (value.length > 0 && value[0] & 0x80) {
      // Negative number
      let twosComplement =
        BigInt("0x" + hex) - (BigInt(1) << BigInt(value.length * 8));
      return new Decimal(twosComplement.toString())
        .dividedBy(new Decimal(10).pow(this.scale))
        .toNumber();
    } else {
      // Positive number
      let bigInt = BigInt("0x" + hex);
      return new Decimal(bigInt.toString())
        .dividedBy(new Decimal(10).pow(this.scale))
        .toNumber();
    }
  }
}
