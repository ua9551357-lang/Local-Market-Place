import { Controller, Post, Body } from '@nestjs/common';
import { VoiceService } from './voice.service';

@Controller('voice')
export class VoiceController {
  constructor(private voiceService: VoiceService) {}

  @Post('intent')
  parseIntent(@Body('transcript') transcript: string) {
    return this.voiceService.parseIntent(transcript);
  }
}