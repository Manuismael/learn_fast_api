import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { Gpt2Service } from './openai.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Docs } from 'src/entities/file.entity';
import { Historic } from 'src/entities/historic.entity';
//import { OpenAIService } from './openai.service';

@Module({
  imports:[TypeOrmModule.forFeature([Docs]), TypeOrmModule.forFeature([Historic])],
  controllers: [FileController],
  providers: [FileService, Gpt2Service]
})
export class FileModule {}
