import io
import avro.schema
from avro.io import DatumWriter, DatumReader, BinaryEncoder, BinaryDecoder

# Avro schema
schema_json = """
{
    "type": "record",
    "name": "Pet",
    "fields": [
        {
            "name": "kind",
            "type": { "type": "enum", "name": "PetKind", "symbols": ["CAT", "DOG"] }
        },
        { "name": "name", "type": "string" },
        { "name": "height", "type": "float" },
        { "name": "length", "type": "double" }
    ]
}
"""

schema = avro.schema.parse(schema_json)

# sample data
pet_data = {
    "kind": "CAT",
    "name": "Albert",
    "height": 123.45,
    "length": 123.45
}

# ===== Encode =====
bytes_writer = io.BytesIO()
encoder = BinaryEncoder(bytes_writer)
datum_writer = DatumWriter(schema)
datum_writer.write(pet_data, encoder)

encoded_bytes = bytes_writer.getvalue()
print("Encoded bytes:", encoded_bytes)

# ===== Decode =====
bytes_reader = io.BytesIO(encoded_bytes)
decoder = BinaryDecoder(bytes_reader)
datum_reader = DatumReader(schema)

decoded_data = datum_reader.read(decoder)
print("Decoded data:", decoded_data)
