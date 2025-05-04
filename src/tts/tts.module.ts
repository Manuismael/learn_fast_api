import { Module } from '@nestjs/common';
import { TtsController } from './tts.controller';

@Module({
  providers: [],
  controllers: [TtsController]
})
export class TtsModule {}
