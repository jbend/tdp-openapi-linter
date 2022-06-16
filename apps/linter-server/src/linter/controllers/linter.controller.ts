import { Controller, Options, Header, Post, Req, HttpCode } from '@nestjs/common';
import { problems, buildProblemResponse } from '../problems';
import { Request } from 'express';
import { LinterService } from '../linter/linter.service';
import { Logger } from '@nestjs/common';

@Controller()
export class LinterController {

  constructor(private linterService: LinterService) { }

  @Options('/linter')
  @Header('Access-Control-Allow-Origin', '*')
  @Header('Access-Control-Allow-Methods', 'GET, OPTIONS')
  @Header('Access-Control-Allow-Headers', 'Content-Type')
  @Header('Access-Control-Max-Age', '86400')
  @HttpCode(204)
  options() {
    return '';
  }

  @Post('/linter')
  @Header('Access-Control-Allow-Origin', '*')
  @Header('Content-Type', 'application/json; charset=utf-8')
  @HttpCode(200)
  async postLinter(@Req() request: Request ) {
    Logger.log('✅ Entering linter controller')
    try {
      // Logger.debug('✅ Request body: ' + JSON.stringify(request.body));
      // Logger.debug('✅ Request Query: ' + JSON.stringify(request.query));
      const ruleSet = request.query.rulesUrl || 'trimble-default';
      // Logger.debug('✅ RuleSet: ' + ruleSet);


      const results = await this.linterService.linter(
        request.body,
        ruleSet,
      );
      // request.url.searchParams.get('rulesUrl'),
      return JSON.stringify(results);

    } catch (err) {
      // console.error(err.message);
      Logger.error(err.message);

      switch (err.name) {
        case 'SpecSyntaxError':
          return buildProblemResponse(problems.INVALID_REQUEST_BODY_SYNTAX);
        case 'TypeScriptCompilationError':
          return buildProblemResponse(problems.TYPESCRIPT_COMPILATION_FAILURE);
        case 'InvalidRulesetError':
          return buildProblemResponse(problems.INVALID_RULESET_PROVIDED);
        case 'LinterExecutionError':
          return buildProblemResponse(problems.LINTER_EXECUTION_ERROR);
        default:
          return buildProblemResponse(problems.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
