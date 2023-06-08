import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from 'src/kafkajs/consumer.service';
import { stringToJson } from 'src/utils/convert-json.util';
import { DepositService } from './deposit.service';

@Injectable()
export class DepositConsumer implements OnModuleInit {
  constructor(
    private readonly consumerService: ConsumerService,
    private readonly depositSerive: DepositService,
  ) { }

  async onModuleInit() {
    await this.consumerService.consume(
      { topics: ['deposit_process', 'deposit_process_success', 'transfer_deposit_process', 'transfer_deposit_process_failed'] },
      {
        eachMessage: async ({ topic, partition, message }) => {
          console.log({ topic });
          if (topic === 'deposit_process' || topic === 'transfer_deposit_process') {
            this.depositSerive.depositProcess(stringToJson(message));
          } else if (topic === 'deposit_process_success') {
            this.depositSerive.depositProcessSuccess(stringToJson(message));
          } else if (topic === 'transfer_deposit_process_failed') {
            this.depositSerive.depositProcessFailed(stringToJson(message))
          }
        },
      },
    );
  }
}
