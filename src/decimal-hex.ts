import Decimal from "decimal.js";
import * as avro from "avsc";

/**
 * This is a self implemented version of Decimal encoding and decoding.
 * In the implementation, we encode Decimal/Number to hexadecimal format.
 * encode and decode need to be used correspondingly.
 */
class DecimalType extends avro.types.LogicalType {
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
  _toValue(val: number | InstanceType<typeof Decimal>): Buffer {
    const decimalVal = val instanceof Decimal ? val : new Decimal(val);

    if (decimalVal.precision(true) > this.precision) {
      throw new Error(
        `Value exceeds precision ${this.precision}: ${decimalVal.toString()}`
      );
    }

    // Scale up to remove decimals
    let unscaled = decimalVal
      .times(new Decimal(10).pow(this.scale))
      .toDecimalPlaces(0);

    // Safety range check before encoding
    if (unscaled.abs().greaterThan(Number.MAX_SAFE_INTEGER)) {
      throw new Error(
        `Unscaled value ${unscaled.toString()} exceeds safe integer range (${
          Number.MAX_SAFE_INTEGER
        }).`
      );
    }

    // Convert to hex and Calculate required bytes
    const hexLen = unscaled.abs().toNumber().toString(16).length;
    const byteLen = Math.ceil(hexLen / 2) || 1;
    const max = new Decimal(2).pow(byteLen * 8);

    // Two's complement for negative numbers
    if (unscaled.isNegative()) {
      unscaled = max.plus(unscaled);
    }

    // Simple version: Convert to hexadecimal using Number
    let hex = unscaled.toNumber().toString(16);
    // Pad to ensure even number of bytes
    if (hex.length % 2) hex = "0" + hex;

    return Buffer.from(hex, "hex");
  }

  /**
   * Decoding: Buffer => Number
   * Limitation: Return value absolute value <= Number.MAX_SAFE_INTEGER
   */
  _fromValue(buf: Buffer): number {
    if (!Buffer.isBuffer(buf)) {
      throw new Error("Input must be a Buffer");
    }

    const byteLen = buf.length;
    const max = new Decimal(2).pow(byteLen * 8);

    // Convert Buffer to hexadecimal
    let hex = buf.toString("hex");
    if (!hex) return 0;

    // Convert back to unsigned integer
    let unscaled = new Decimal(parseInt(hex, 16));

    // Restore negative number from two's complement
    const signBit = buf[0] & 0x80;
    if (signBit) {
      unscaled = unscaled.minus(max);
    }

    // Scale down
    let decimalVal = unscaled.div(new Decimal(10).pow(this.scale));

    // Safety range check after decoding
    if (decimalVal.abs().greaterThan(Number.MAX_SAFE_INTEGER)) {
      throw new Error(
        `Decoded value ${decimalVal.toString()} exceeds safe integer range (${
          Number.MAX_SAFE_INTEGER
        }).`
      );
    }

    return decimalVal.toNumber();
  }
}

export default DecimalType;
