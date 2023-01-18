import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
// import fs from 'fs';
const fs = require('fs');
const mv = require('mv');

// import path from 'path';
const path = require('path');
const unzipper = require('unzipper');
const compressing = require('compressing');

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          // const r = fs.createReadStream(
          //   path.resolve('./uploads', file.originalname),
          // );
          // const w = fs.createWriteStream(path.resolve('./uploads/dist/'));
          // // r.pipe(unzipper.Extract({ path: './uploads/' }));
          // r.pipe(w);
          const distDir = path.resolve('./uploads', file.originalname);
          console.log(distDir);
          fs.rmSync(path.resolve('./uploads'), {
            recursive: true,
            force: true,
          });
          compressing.tgz
            .uncompress(distDir, './uploads')
            .then(e => {
              console.log('解压完成');
              mv(
                path.resolve('./uploads', 'dist/'),
                path.resolve('./uploads/'),
                { mkdirp: true, clobber: false },
                e => {
                  console.log('e ', e);
                },
              );
              // fs.rename(
              //   path.resolve('./uploads', './dist/app.module.js'),
              //   path.resolve('./uploads', './app.module.js'),
              //   e => {
              //     console.log('link :', e);
              //   },
              // );
            })
            .catch(e => {
              console.log('解压失败', e);
            });

          cb(null, file.originalname);
          console.log('file ', file);
        },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
