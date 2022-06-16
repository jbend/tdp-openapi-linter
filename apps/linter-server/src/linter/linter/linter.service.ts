import { writeFile} from 'fs/promises';
import { Injectable, Logger } from '@nestjs/common';
import { OutputFormat, ILintConfig } from '@stoplight/spectral-cli/dist/services/config';
import {
  Document,
  IRuleResult,
  Ruleset,
  Spectral,
} from '@stoplight/spectral-core';
import { getRuleset } from '@stoplight/spectral-cli/dist/services/linter/utils';
import { loadAll } from 'js-yaml';
import * as Parsers from '@stoplight/spectral-parsers';
import * as errors from './errors';
import { transpileModule, ModuleKind } from 'typescript';

type Definition = object;

const defaultRules = 'https://raw.githubusercontent.com/jbend/tdp-spectral-rules/main/rulesets/trimble-default.json';

@Injectable()
export class LinterService {

  private async lint(definitions: Definition[],
    flags: ILintConfig): Promise<[Ruleset, IRuleResult[]]> {

    Logger.log('✅ LinterService lint()')

    const spectral = new Spectral();
    const ruleset = await getRuleset(flags.ruleset);
    spectral.setRuleset(ruleset);

    const results: IRuleResult[] = [];
    for (const [index, definition] of definitions.entries()) {
      const document = new Document(
        JSON.stringify(definition),
        Parsers.Yaml,
        `<REQUEST_BODY_${index}>`,
      );
      results.push(
        ...(await spectral.run(document, {
          ignoreUnknownFormat: flags.ignoreUnknownFormat,
        })),
      );
    }

    return [spectral.ruleset, results];
  }

  public async linter(body: string,
    rulesUrl: string | undefined = defaultRules, // "https://rules.linting.org/testing/base.yaml"
    ): Promise<IRuleResult[]> {

      Logger.log('✅ LinterService linter()')

      const definitions: Array<Definition> = [];

      try {
        //Logger.debug('✅ Parsing YAML' + JSON.stringify(yaml));
        const loaded = loadAll(body); // works with both JSON and YAML.
        if (!Array.isArray(loaded)) {
          definitions.push(loaded as Definition);
        } else if (typeof loaded === 'object' && !!loaded) {
          definitions.push(...loaded);
        } else {
          throw new Error('Request body must be an object or array.');
        }
      } catch (err) {
        throw new errors.SpecSyntaxError(err);
      }

      // Spectral requires URLs to end in .json, .yaml, or .yml.
      const supportedFileExtensions = [
        '.json',
        '.yaml',
        '.yml',
        '.js',
        '.mjs',
        'cjs',
        '.ts',
      ];
      console.log('RulesUrl', rulesUrl);
      if (!supportedFileExtensions.find((ext) => rulesUrl.endsWith(ext))) {
        // Should work for both JSON and YAML.
        // If it's actually JavaScript or TypeScript, ope.
        const testUrl = new URL(rulesUrl);
        const spectralHack = '$spectral-hack$';

        const params = new URLSearchParams(testUrl.search);
        params.append(spectralHack, '.yaml');

        testUrl.search = params.toString();
        rulesUrl = testUrl.toString();
      }

      if (rulesUrl.endsWith('.ts')) {
        // compile to js in /temp and change rulesUrl
        try {
          const response = await fetch(rulesUrl);
          const contents = await response.text();
          const js = transpileModule(contents, {
            compilerOptions: {
              module: ModuleKind.CommonJS,
            },
          });

          if (js.diagnostics?.length) {
            console.log(js.diagnostics);
          }

          await writeFile('/tmp/.spectral.js', js.outputText);
          rulesUrl = '/tmp/.spectral.js';
        } catch (err) {
          throw new errors.TypeScriptCompilationError(err);
        }
      }

      try {
        const [ruleset, results] = await this.lint(definitions, {
          format: [OutputFormat.JSON],
          encoding: 'utf-8',
          ignoreUnknownFormat: false,
          failOnUnmatchedGlobs: true,
          ruleset: rulesUrl,
        });

        const failedCodes = results.map((r) => String(r.code));
        const failures = results.reduce((prev, f) => {
          const id = f.code;
          prev[id] = prev[id] || [];
          prev[id].push(f);
          return prev;
        }, {});

        const allResults = [];
        for (const code of Object.keys(ruleset.rules)) {
          const status = failedCodes.includes(code) ? 'failed' : 'passed';

          const { description: message } = ruleset.rules[code];
          let res = {
            code,
            status,
            message,
          };

          if (status == 'passed') {
            allResults.push(res);
            continue;
          }

          for (const f of failures[code]) {
            const {
              message, path, severity, source, range,
            } = f;
            res = Object.assign({}, res, {
              failure: {
                message,
                path,
                severity,
                source,
                range,
              },
            });
            // res = {
            //   ...res,
            //   failure: {
            //     message,
            //     path,
            //     severity,
            //     source,
            //     range,
            //   },
            // };
            allResults.push(res);
          }
        }

        return allResults;
      } catch (err) {
        if (err.message === 'Invalid ruleset provided') {
          throw new errors.InvalidRulesetError(err);
        }
        throw new errors.LinterExecutionError(err);
      }

  }




}
