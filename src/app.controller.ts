import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import crypto from 'crypto';

@Controller()
export class AppController {
  @Post('encrypt')
  async encrypt(@Body() data: any) {
    return await this._encrypt(data);
  }

  @Post('decrypt')
  async decrypt(@Body() data: any) {
    return await this._decrypt(data);
  }

  _encrypt = (data: string) => {
    const ALGORITHM = 'aes-256-cbc';
    const ENCODING = 'hex';
    const IV_LENGTH = 16;
    const KEY = process.env.ENCRYPTION_KEY!;
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, new Buffer(KEY), iv);
    return Buffer.concat([cipher.update(data), cipher.final(), iv]).toString(
      ENCODING,
    );
  };

  _decrypt = (data: string) => {
    const ALGORITHM = 'aes-256-cbc';
    const ENCODING = 'hex';
    const IV_LENGTH = 16;
    const KEY = process.env.ENCRYPTION_KEY!;
    const binaryData = new Buffer(data, ENCODING);
    const iv = binaryData.slice(-IV_LENGTH);
    const encryptedData = binaryData.slice(0, binaryData.length - IV_LENGTH);
    const decipher = crypto.createDecipheriv(ALGORITHM, new Buffer(KEY), iv);
    return Buffer.concat([
      decipher.update(encryptedData),
      decipher.final(),
    ]).toString();
  };
}
