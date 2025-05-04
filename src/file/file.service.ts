import { Injectable } from '@nestjs/common';
import * as pdfParse from 'pdf-parse'
import * as mammoth from 'mammoth'
import * as fs from 'fs'
import { Gpt2Service } from './openai.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Docs } from 'src/entities/file.entity';
import { Repository } from 'typeorm';
import { DocsDto } from 'src/DTOs/docs.dto';
import { Historic } from 'src/entities/historic.entity';

@Injectable()
export class FileService {

    constructor(
        @InjectRepository(Docs)
        private readonly docsRepository:Repository<Docs>,
        @InjectRepository(Historic)
        private readonly historyRepository:Repository<Historic>,
        private readonly gpt2Service: Gpt2Service) {}
    // Extraire le texte d'un PDF
    async extractPDFText(pdfBuffer: Buffer): Promise<string>{
        const data = await pdfParse(pdfBuffer);
        return data.text;
    }

    async summarizeText(text: string): Promise<string> {
        return this.gpt2Service.summarizeText(text); // Appel au service GPT-2
    }

    async delete(filePath:string){
        fs.unlinkSync(filePath);
    }

    async saveFiles(docs: any){
        return this.docsRepository.save(docs);
    }

    async historics(history:any){
        return this.historyRepository.save(history);
    }
}
