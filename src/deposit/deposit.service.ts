import { Injectable } from '@nestjs/common';
import { ConsumerService } from 'src/kafkajs/consumer.service';
import { ProducerService } from 'src/kafkajs/producer.service';
import { DepositRepository } from './repository/deposite.repository';

interface IDepositProcess {
  account_number: string;
  balance: string;
  amount: string;
}

interface IDepositProcessSuccess {
  account_number: string;
  old_balance: string;
  new_balance: string;
  status: string;
}

@Injectable()
export class DepositService {
  constructor(
    private readonly consumerService: ConsumerService,
    private readonly depositRepository: DepositRepository,
    private readonly producerService: ProducerService,
  ) {}

  async depositProcess(data: IDepositProcess) {
    console.log(data);
    const deposit = await this.depositRepository.createDeposit({
      account_number: data.account_number,
      old_balance: data.balance,
      new_balance: (Number(data.balance) + Number(data.amount)).toString(),
      uuid: '0001',
      transaction_type: 'cash',
      amount: data.amount,
    });
    await this.producerService.produce({
      topic: 'account_update_balance',
      messages: [
        {
          value: JSON.stringify({
            account_number: data.account_number,
            old_balance: data.balance,
            new_balance: Number(data.balance) + Number(data.amount),
          }),
        },
      ],
    });
  }

  async depositProcessSuccess(data: IDepositProcessSuccess) {
    console.log('deposit success', data);
    return data;
  }
}
