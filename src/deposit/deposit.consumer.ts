import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from 'src/kafkajs/consumer.service';
import { stringToJson } from 'src/utils/convert-json.util';
import { DepositService } from './deposit.service';

@Injectable()
export class DepositConsumer implements OnModuleInit {
  constructor(
    private readonly consumerService: ConsumerService,
    private readonly depositSerive: DepositService,
  ) {}

  async onModuleInit() {
    await this.consumerService.consume(
      { topics: ['deposit_process', 'deposit_process_success'] },
      {
        eachMessage: async ({ topic, partition, message }) => {
          console.log({ message: stringToJson(message) });
          if (topic === 'deposit_process')
            this.depositSerive.depositProcess(stringToJson(message));
          else if (topic === 'deposit_process_success') {
            this.depositSerive.depositProcessSuccess(stringToJson(message));
          }
        },
      },
    );
  }
}
