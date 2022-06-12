import { Injectable } from '@nestjs/common';

export interface HelpMessage {
  api: {
    title: string;
  };
  resource: string;
}

@Injectable()
export class AppService {
  getData(): { message: string } {
    return { message: 'Welcome to linter-server!' };
  }

  getHelp(): { message: HelpMessage } {
    return {
      message: {
        api: {
          title: 'API Spec Linter'
        },
        resource: 'v1/linter',
      }
    };
  }

  postLinter(): { message: string } {
    return { message: 'Linter is running' };
  }
}
