import { RunCommand } from '@/cli/RunCommand';
import { SearchCommand } from '@/cli/SearchCommand';
import { Logger } from '@/core/Logger';
import { diContainer } from '@/di/Container';
import { Inject } from '@/di/InjectDecorator';
import chalk from 'chalk';
import { Command } from 'commander';
import { description, name, version } from '../../package.json';

export class CodxCli {
  constructor(@Inject(Logger) private readonly logger: Logger) {}

  static run(process: NodeJS.Process) {
    const codxCli = diContainer.get(CodxCli);

    codxCli.displayBanner();

    const program = codxCli.getProgram();

    codxCli.bindCommands(program);

    program.showHelpAfterError();

    if (process.argv.length <= 2) {
      program.outputHelp({ error: false });

      return;
    }

    program.parse(process.argv);
  }

  private bindCommands(program: Command) {
    program
      .command('run')
      .description('Execute a recipe')
      .argument('<name-or-path>', 'Recipe name / Path to local recipe file')
      .option('--pm <package-manager>', 'Force package manager to use (npm, pnpm, yarn, bun)')
      .option('-p, --project-dir <project-dir>', 'Force working directory to use', '.')
      .option('-v, --verbose', 'Display more messages')
      .action(async (...args) => diContainer.get(RunCommand).execute(...args));

    program
      .command('search')
      .description('Search for npm packages related to codx recipes')
      .argument('<search-term>', 'Search term to find related packages')
      .option('-v, --verbose', 'Display more messages')
      .action(async (...args) => diContainer.get(SearchCommand).execute(...args));
  }

  private displayBanner() {
    this.logger.message(
      chalk.grey.bold(`
  ,ad8888ba,                         88  ${chalk.blue.bold(`v${version}`.padStart(11, ' '))}
 d8"'    \`"8b                        88
d8'                                  88
88              ,adPPYba,    ,adPPYb,88  8b,     ,d8
88             a8"     "8a  a8"    \`Y88   \`Y8, ,8P'
Y8,            8b       d8  8b       88     )888(
 Y8a.    .a8P  "8a,   ,a8"  "8a,   ,d88   ,d8" "8b,
  \`"Y8888Y"'    \`"YbbdP"'    \`"8bbdP"Y8  8P'     \`Y8
  `),
    );
    this.logger.message(chalk.blue(description));
    this.logger.message('');
  }

  private getProgram() {
    const program = new Command();

    program.name(name).description(description).version(version);

    return program;
  }
}
