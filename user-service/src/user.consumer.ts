import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from './kafka/consumer.service';

@Injectable()
export class UserConsumer implements OnModuleInit {
  constructor(private readonly consumerService: ConsumerService) {}
  async onModuleInit() {
    await this.consumerService.consume(
      { topics: ['order-shipped', 'order-placed'] },
      {
        eachMessage: async ({ topic, partition, message }) => {
          console.log({
            value: JSON.parse(message.value.toString()),
            topic: topic,
            partition: partition,
          });
        },
      },
    );
  }
}