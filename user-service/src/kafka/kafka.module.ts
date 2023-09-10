import { Module } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { ConsumerService } from './consumer.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [ProducerService, ConsumerService, ConfigService],
  exports: [ProducerService, ConsumerService],
})
export class KafkaModule {}
