import { Module } from '@nestjs/common';

import { HomeController, LinterController, VersionController } from './controllers';
import { LinterService } from './linter/linter.service';

@Module({
  imports: [],
  controllers: [HomeController, LinterController, VersionController],
  providers: [LinterService],
})
export class LinterModule {}
