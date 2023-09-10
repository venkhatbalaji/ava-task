#!/bin/bash
set -e

# Define an array of topic names
TOPICS=("order-placed" "user-updated" "product-added")

# Create Kafka topics in a loop
for TOPIC in "${TOPICS[@]}"; do
  docker run \
    --rm \
    --network=host \
    wurstmeister/kafka:latest \
    kafka-topics --create --topic $TOPIC --partitions 1 --replication-factor 1 --if-not-exists --zookeeper localhost:2181

  echo "Created Kafka topic: $TOPIC"
done
