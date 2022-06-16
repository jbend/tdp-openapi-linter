import { Controller, Get, Post } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * This is the root GET endpoint. Will return instructions for how to use the API.
   * @returns
   */
  @Get()
  getData() {
    return this.appService.getHelp();
  }

  /**
   * Main linter endpoint
   * @returns
   */
  @Post('linter')
  postLinter() {
    return this.appService.postLinter();
  }


}
