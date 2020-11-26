import { Injectable } from '@nestjs/common';
import { ModuleRepository } from 'src/modules/modules.repository';
import { UserRepository } from 'src/users/users.repository';
import { UserStatisticsDTO } from './dto/user.stats.dto';

@Injectable()
export class StatisticsService {
  constructor(private readonly userRepo: UserRepository, private readonly moduleRepo: ModuleRepository) {}
  async getUserStatistics(id: number): Promise<UserStatisticsDTO> {
    const modules = await this.moduleRepo.getAllByStudent(id);

    return new UserStatisticsDTO();
  }
}
