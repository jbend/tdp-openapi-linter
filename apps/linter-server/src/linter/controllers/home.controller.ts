import { Controller, Get, Options, Header, HttpCode } from '@nestjs/common';

@Controller()
export class HomeController {

  @Options('/')
  @Header('Access-Control-Allow-Origin', '*')
  @Header('Access-Control-Allow-Methods', 'GET, OPTIONS')
  @Header('Access-Control-Max-Age', '86400')
  @HttpCode(204)
  optionsHome() {
    return '';
  }

  @Get('/')
  @Header('Access-Control-Allow-Origin', '*')
  @Header('Content-Type', 'application/home+json')
  getHome() {
    return {
      api: {
        title: 'API Spec Linter',
      },
      resources: {
        'tag:linting.org,2022:linter': {
          hrefTemplate: '/linter{?rulesUrl}',
          hrefVars: {
            rulesUrl: 'tag:linting.org,2022:linter/url#rulesUrl',
          },
          hints: {
            allow: ['POST'],
            formats: {
              'application/json': {},
            },
            acceptPost: ['application/json', 'text/yaml'],
          },
        },
      }
    };
  }
}
