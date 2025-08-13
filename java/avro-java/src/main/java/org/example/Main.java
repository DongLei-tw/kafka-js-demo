package org.example;

import org.apache.avro.LogicalTypes;
import org.apache.avro.Schema;
import org.apache.avro.generic.GenericData;
import org.apache.avro.generic.GenericDatumReader;
import org.apache.avro.generic.GenericDatumWriter;
import org.apache.avro.io.BinaryDecoder;
import org.apache.avro.io.BinaryEncoder;
import org.apache.avro.io.DecoderFactory;
import org.apache.avro.io.EncoderFactory;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

public class Main {
    public static void main(String[] args) throws IOException {
        System.out.println("Hello, World!");

        float a = 16777216f;
        System.out.printf("a: %f%n", a);
        System.out.printf("a + 1: %f%n", a + 1);


        // Avro Schema
        String schemaJson = "{"
                + "\"type\": \"record\","
                + "\"name\": \"Pet\","
                + "\"fields\": ["
                + "    {"
                + "        \"name\": \"kind\","
                + "        \"type\": { \"type\": \"enum\", \"name\": \"PetKind\", \"symbols\": [\"CAT\", \"DOG\"] }"
                + "    },"
                + "    { \"name\": \"name\", \"type\": \"string\" },"
                + "    { \"name\": \"height\", \"type\": \"float\" },"
                + "    { \"name\": \"length\", \"type\": \"double\" }"
                + "]"
                + "}";

        Schema schema = new Schema.Parser().parse(schemaJson);

        // sample data
        GenericData.Record pet = new GenericData.Record(schema);
        pet.put("kind", new GenericData.EnumSymbol(schema.getField("kind").schema(), "CAT"));
        pet.put("name", "Albert");
        pet.put("height", 1.23f);
        pet.put("length", 1.23f);

        // ===== Encode =====
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        BinaryEncoder encoder = EncoderFactory.get().binaryEncoder(out, null);
        GenericDatumWriter<GenericData.Record> writer = new GenericDatumWriter<>(schema);
        writer.write(pet, encoder);
        encoder.flush();
        byte[] encodedBytes = out.toByteArray();

        System.out.println("Encoded bytes: " + java.util.Arrays.toString(encodedBytes));

        // ===== Decode =====
        BinaryDecoder decoder = DecoderFactory.get().binaryDecoder(encodedBytes, null);
        GenericDatumReader<GenericData.Record> reader = new GenericDatumReader<>(schema);
        GenericData.Record decodedPet = reader.read(null, decoder);

        System.out.println("Decoded data: " + decodedPet);

    }
}