import { Module } from '@nestjs/common';
import { AuthService } from './auths.service';
import { AuthsController } from './auths.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from '../entities/auths.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Auth])],
  providers: [AuthService],
  controllers: [AuthsController]
})
export class AuthsModule {}
