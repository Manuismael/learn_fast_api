import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileModule } from './file/file.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthsModule } from './auths/auths.module';
import { Auth } from './entities/auths.entity';
import { TtsModule } from './tts/tts.module';
import { Docs } from './entities/file.entity';
import { Historic } from './entities/historic.entity';
import { QuizModule } from './quiz/quiz.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost', 
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ihsane',
      entities: [Auth, Docs, Historic],
      synchronize: false,
    }),
    
    FileModule,AuthsModule, TtsModule, QuizModule,],
  controllers: [AppController,],
  providers: [AppService],
})
export class AppModule {}
