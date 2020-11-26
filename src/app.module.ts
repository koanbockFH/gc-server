import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ModulesModule } from './modules/modules.module';
import * as ormconfig from './ormconfig';
import { UsersModule } from './users/users.module';
import { AttendanceModule } from './attendance/attendance.module';

@Module({
  imports: [AuthModule, UsersModule, ModulesModule, TypeOrmModule.forRoot(ormconfig), AttendanceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
