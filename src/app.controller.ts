import {
  Body,
  Controller,
  Get,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { AppService } from './app.service';
import { SampleDto } from './sample.dto';
// import fs from 'fs';
const fs = require('fs');
// import { Buffer } from 'node:buffer';
const { Buffer } = require('node:buffer');

import path from 'path';
import unzipper from 'unzipper';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  sayHello() {
    return this.appService.getHello();
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('file')
  async uploadFile(
    @Body() body: SampleDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // const r = fs.createReadStream(file.buffer);
    // const w = fs.createWriteStream(path.resolve(__dirname, file.originalname));
    // r.pipe(w);
    // file.stream.pipe(unzipper.Extract({ path: './uploads' }));
    // file.stream.pipe(w);
    // fs.readFileSync(new Buffer.from(file.buffer, 'utf8'));
    console.log(file);

    // file.stream;
    // console.log('body ', body);
    // console.log('file ', file);
    // debugger;

    return 'will done';
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('file/pass-validation')
  uploadFileAndPassValidation(
    @Body() body: SampleDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'json',
        })
        .build({}),
    )
    file?: Express.Multer.File,
  ) {
    return {
      body,
      file: file?.buffer.toString(),
    };
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('file/fail-validation')
  uploadFileAndFailValidation(
    @Body() body: SampleDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'jpg',
        })
        .build(),
    )
    file: Express.Multer.File,
  ) {
    return {
      body,
      file: file.buffer.toString(),
    };
  }
}
