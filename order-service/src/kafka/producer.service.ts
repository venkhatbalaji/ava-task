// producer.service.ts
import { Injectable, OnModuleInit, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';

@Injectable()
export class ProducerService implements OnModuleInit, OnApplicationShutdown {
  constructor(private readonly configservice: ConfigService) {}
  private readonly kafkaClient = new Kafka({
    brokers: [this.configservice.get<string>('KAFKA_SERVER')],
    requestTimeout: 60000,
  });
  private readonly producer: Producer = this.kafkaClient.producer();

  async onModuleInit() {
      await this.producer.connect();
  }

  async produce(record: ProducerRecord){
    await this.producer.send(record);
  }

  async onApplicationShutdown(){
    await this.producer.disconnect();
  }
}
