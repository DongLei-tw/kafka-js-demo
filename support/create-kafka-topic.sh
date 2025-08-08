#!/bin/bash
set -eufo pipefail

BROKER_URL=broker:9092
REPLICA_NUM=1
PARTITION_NUM=3


KAFKA_TOPICS=("events.property.conformed.attributes.v1")

for topic in ${KAFKA_TOPICS[@]}; do
  command="kafka-topics --create --bootstrap-server $BROKER_URL \
          --replication-factor $REPLICA_NUM \
          --partitions $PARTITION_NUM \
          --topic ${topic}"
  echo "${command}"
  eval "${command}"
done
