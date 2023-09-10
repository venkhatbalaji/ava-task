// consumer.service.ts
import {
  Injectable,
  OnModuleInit,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Kafka,
  Consumer,
  ConsumerRunConfig,
  ConsumerSubscribeTopics,
} from 'kafkajs';

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
  constructor(private readonly configservice: ConfigService) {}
  private readonly kafkaClient = new Kafka({
    brokers: [this.configservice.get<string>('KAFKA_SERVER')],
    requestTimeout: 60000,
  });
  private readonly consumers: Consumer[] = [];

  async consume(topic: ConsumerSubscribeTopics, config: ConsumerRunConfig) {
    const consumer = this.kafkaClient.consumer({ groupId: 'nest-kafka' });
    await consumer.connect();
    await consumer.subscribe(topic);
    await consumer.run(config);
    this.consumers.push(consumer);
  }

  async onApplicationShutdown() {
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }
}
