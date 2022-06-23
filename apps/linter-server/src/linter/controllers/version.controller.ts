import { Controller, Options, Header, Get, Logger } from '@nestjs/common';


@Controller()
export class VersionController {

  @Get('/version')
  @Header('Content-Type', 'application/json')
  getVersion() {
    Logger.log('GET /version')
    return JSON.stringify(
        {
          "version": "0.0.2"
        }
      );
  }

}
