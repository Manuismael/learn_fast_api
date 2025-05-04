import { Controller, Post,UploadedFile,UseInterceptors,BadRequestException, } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
//import { OpenAIService } from './openai.service';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs'
import { Gpt2Service } from './openai.service';
import { writeFile } from 'fs';

@Controller('file')
export class FileController {
    filePath:any;
    constructor(private readonly fileService: FileService, private readonly gpt2Service: Gpt2Service) {}

    @Post('upload')
    @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + path.extname(file.originalname));
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          cb(null, true);
        } else {
          cb(new BadRequestException('Only PDF or DOCX files are allowed'), false);
        }
      },
    }),
  )

  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    this.filePath = file.path;
    let extractedText = '';

    try {
      if (file.mimetype === 'application/pdf') {
        const pdfBuffer = fs.readFileSync(this.filePath);
        extractedText = await this.fileService.extractPDFText(pdfBuffer);
      }

      function sanitizeText(input: any): string {
        if (!input) return '';
      
        const text = typeof input === 'string' ? input : String(input);
      
        return text
          .replace(/\*\*/g, '') // supprime le gras Markdown (**text**)
          .replace(/__([^_]+)__/g, '$1') // supprime souligné Markdown (__text__)
          .replace(/[_*`~]/g, '') // supprime les caractères Markdown restants
          .replace(/<[^>]*>/g, '') // supprime toutes les balises HTML
          .replace(/\r?\n|\r/g, ' ') // remplace les sauts de ligne par un espace
          .trim(); // supprime les espaces au début et à la fin
      }

      const libelle =await this.gpt2Service.historyName(extractedText);
      
      const summary = await this.gpt2Service.summarizeText(extractedText); // Appel au service Gemini pour le resumer
      await this.fileService.historics({libelle: sanitizeText(libelle.response.candidates[0].content.parts[0].text),content:sanitizeText(summary.response.candidates[0].content.parts[0].text), id_user:1, id_docs:70});

      // genérer un fichier json pour le qcm de test de connaissances
      const qcm = await this.gpt2Service.GenerateQuizJson(extractedText);
      console.log(qcm.text);

      // Définition du chemin du dossier et du fichier JSON
      const documentsDir = path.join(process.cwd(), 'quiz');
      const jsonPath = path.join(documentsDir, 'questions.json');

      // Vérifier et créer le dossier 'documents' si nécessaire
      if (!fs.existsSync(documentsDir)) {
        try {
          fs.mkdirSync(documentsDir, { recursive: true });
          console.log('Dossier "documents" créé avec succès.');
        } catch (error) {
          throw new Error(`Erreur lors de la création du dossier "documents": ${error.message}`);
        }
      }

      // Écriture des questions dans le fichier JSON
      try {
        const jsonData = JSON.stringify(qcm, null, 2);
        fs.writeFileSync(jsonPath, jsonData, 'utf8');
        console.log(`Fichier JSON sauvegardé dans : ${jsonPath}`);
      } catch (error) {
        throw new Error(`Erreur lors de l'écriture du fichier JSON: ${error.message}`);
      }

      return { summary, qcm }; // Retourner le résumé
     

    } finally {
      // save le fichier après traitement
      await this.fileService.saveFiles({path:this.filePath});
    }
  }

}
