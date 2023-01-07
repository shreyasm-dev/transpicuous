import sourceMapSupport from 'source-map-support';
import { readFileSync } from 'fs';
import Prompt from 'zpr';
import { program } from 'commander';
import Conf from 'conf';
import defaultPrompt from './default-prompt';
import defaultConfig, { schema } from './config';

sourceMapSupport.install();

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

program
  .name(pkg.name)
  .description(pkg.description)
  .version(pkg.version);

program
  .command('default')
  .description('Print the default shell prompt')
  .action(() => {
    console.log(`PROMPT="${defaultPrompt.left}"\nRPROMPT="${defaultPrompt.right}"`);
  });

const config = program
  .command('config')
  .description('Get or set configuration values');

config
  .command('get <key>')
  .description('Get a configuration value')
  .action((key) => {
    console.log(defaultConfig.get(key));
  });

config
  .command('set <key> <value>')
  .description('Set a configuration value')
  .action((key, value) => {
    // If the current value isn't a string, validate the new value
    switch (typeof (schema as any)[key].default) {
      case 'boolean':
        if (value !== 'true' && value !== 'false') {
          console.error(`Invalid value for ${key}: ${value}`);
          process.exit(1);
        }

        defaultConfig.set(key, value === 'true');
        break;
      case 'string':
        defaultConfig.set(key, value);
        break;
      default:
        console.error(`Invalid value for ${key}: ${value}`);
        process.exit(1);
    }
  });

config
  .command('default <key>')
  .description('Get the default value for a configuration key')
  .action((key) => {
    console.log((schema as any)[key].default);
  });

config
  .command('reset <key>')
  .description('Reset a configuration value to its default')
  .action((key) => {
    defaultConfig.delete(key);
  });

program
  .command('prompt')
  .description('Print the shell prompt')
  .action(() => {
    const promptEnd = defaultConfig.get('promptEnd') as string;
    const exitCode = defaultConfig.get('showExitCode');
    const cwd = defaultConfig.get('showCwd');
    const time = defaultConfig.get('showTime');

    let left = new Prompt();
    let right = new Prompt();

    if (exitCode) {
      left = left
        .colorOpen('red')
        .text('[')
        .lastCommandStatus()
        .text('] ')
        .colorClose()
        .text(' ');
    }

    if (cwd) {
      left = left
        .colorOpen('green')
        .cwdFromHome()
        .colorClose()
        .text(' ');
    }

    if (time) {
      right = right
        .time24Seconds()
        .text(' ');
    }

    left = left
      .colorOpen('blue')
      .text(promptEnd)
      .colorClose()
      .text(' ');

    console.log(`PROMPT="${left}"\nRPROMPT="${right}"`);
  });

program.parse();

if (program.args.length === 0) {
  program.help();
}
