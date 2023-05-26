import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DataSource, Repository } from 'typeorm';
import { RequestDeposit } from '../dto/deposit.dto';
import { Deposit } from '../entities/deposit.entity';

interface DepositDateBetween {
  startDate: Date;
  endDate?: Date;
}

@Injectable()
export class DepositRepository extends Repository<Deposit> {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Deposit) private depositRepository: Repository<Deposit>,
  ) {
    super(Deposit, dataSource.createEntityManager());
  }

  async createDeposit(depositData: RequestDeposit) {
    try {
      const createDeposit = this.depositRepository.create({
        uuid: depositData.uuid,
        amount: depositData.amount,
        old_balance: depositData.old_balance,
        new_balance: depositData.new_balance,
        transaction_type: depositData.transaction_type,
        account_number: depositData.account_number,
      });
      return await this.depositRepository.save(createDeposit);
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteDeposit(depositId: number) {
    try {
      const depositRecord = await this.depositRepository.findOneBy({
        deposit_id: depositId,
      });
      return await this.depositRepository.remove(depositRecord);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getDepositByDate(depositDateBetween: DepositDateBetween) {
    try {
      return await this.depositRepository.find({
        where: {
          created_date: Between(
            depositDateBetween.startDate,
            depositDateBetween.endDate,
          ),
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
