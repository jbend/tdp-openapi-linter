import { Module } from '@nestjs/common';

import { HomeController, LinterController } from './controllers';
import { LinterService } from './linter/linter.service';

@Module({
  imports: [],
  controllers: [HomeController, LinterController],
  providers: [LinterService],
})
export class LinterModule {}
