import { Controller, Get } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';

@Controller('quiz')
export class QuizController {
    @Get()
    getQuiz(){
        const path=join(process.cwd(), 'documents','questions.json');
        const content= readFileSync(path, 'utf-8');
        return JSON.parse(content);
    }
}
