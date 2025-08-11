# Kafak JS Demo

## Development Dependency

Spin up the zookeeper, broker, schema-registry

```sh
docker-compose up
```

(Optional) Migrate avro schema. It's a optional step, the producer can do it later.

```sh
./support/migrate-schema.sh
```

## Run

Ensure the docker-compose services are started correctly before running the application.

```
npm run dev
```

The producer and consumer will be run successively.

## Issue

Float value drifed.

<details>
<summary>Avro Schema</summary>

```json
{
  "type": "record",
  "name": "AttributesV1",
  "namespace": "com.property.conformed",
  "doc": "Property Attributes record.",
  "fields": [
    {
      "name": "propertyId",
      "type": "int",
      "doc": "The unique identifier for the property."
    },
    {
      "name": "bedrooms",
      "type": [
        "null",
        "int"
      ],
      "doc": "The details of the bedrooms.",
      "default": null
    },
    {
      "name": "livingArea",
      "type": [
        "null",
        "float"
      ],
      "doc": "The details of the livingArea.",
      "default": null
    }
  ]
}
```

</details>

Producer sends a message with `livingArea: 123.45` (two digits).

```
{
  propertyId: 1,
  bedrooms: 2,
  livingArea: 123.45,
}
```

However, after the consumer read and decode the message, the livingArea drifted a bit to `123.44999694824219`.


---

Resolved, after use `double` type instead of `float` the value drifting issue is gone.
