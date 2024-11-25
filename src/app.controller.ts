import { Controller, Get, Redirect, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Redirect('http://localhost:3000/api', 302)
  getHello(@Res() res: Response){
  }
}
