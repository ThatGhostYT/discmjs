#!/usr/bin/env node

import ora from 'ora';
import yargs from 'yargs';
import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import { execa } from 'execa';
import { hideBin } from 'yargs/helpers';
import { fileURLToPath } from 'url';
import { CliSettings } from './types.js';
import { Logger } from './Logger.js';
import {
	promptName,
	promptLanguage,
	promptManager,
	promptInstall,
	promptGitInit,
	promptOverwrite,
	promptCommand,
	promptCopyDir
} from './prompts.js';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '../');

console.log(ROOT);

const logger = new Logger();

const defaultSettings: CliSettings = {
	name: 'my-discm-js-bot',
	language: 'js',
	pm: 'npm',
	flags: {
		install: true,
		initGit: false
	}
};

(async () => {
	let settings: CliSettings = defaultSettings;

	const argv = await yargs(hideBin(process.argv))
		.help()
		.version()
		.option('y', {
			type: 'boolean',
			description: 'Use default settings.'
		})
		.command(
			'command',
			false,
			{
				command: {
					type: 'string'
				},
				language: {
					type: 'string'
				},
				copyDir: {
					type: 'string'
				}
			},
			async (yargs) => {
				let lang = (yargs._[2] || (await promptLanguage())) as
					| 'js'
					| 'ts';
				let command =
					(yargs._[1] as string) || (await promptCommand(lang));
				let copyDir = (yargs._[3] as string) || (await promptCopyDir());

				const spinner = ora('Templating ...\n').start();

				const templateDir = path.join(
					ROOT,
					'templates',
					'commands',
					lang
				);

				for (const file of fs.readdirSync(
					`${templateDir}/${command}`
				)) {
					const filename = `${copyDir}/commands/${file}`;
					if (fs.existsSync(filename)) {
						if (fs.readFileSync(filename).length === 0) {
							spinner.info(
								`Command ${command} already exists but is empty. Continuing ...\n`
							);
						} else {
							spinner.stopAndPersist();

							const overwrite = await promptOverwrite(command);

							if (overwrite === 'cancel') {
								spinner.fail('Cancelling installation ...');
								process.exit(0);
							} else if (overwrite === 'clear') {
								spinner.info(
									`Clearing ${chalk.cyan.bold(
										file
									)} and installing the command ...\n`
								);

								fs.writeFileSync(filename, '');
							}
						}
					}
					fs.copySync(
						path.join(templateDir,command,file),
						filename
					);
				}

				spinner.succeed(
					'Successfully added the command to your project!'
				);
				process.exit(0);
			}
		).argv;

	logger.message(
		'Welcome to the {cyan:create-discm cli}. Thanks for chosing {cyan:discm.js} to improve your production experience.\n'
	);

	if (!argv.y) {
		settings = {
			name: await promptName(),
			language: await promptLanguage(),
			pm: await promptManager(),
			flags: {
				install: await promptInstall(),
				initGit: await promptGitInit()
			}
		};
	}

	const spinner = ora('Scaffolding ...\n').start();

	const projectDir = path.resolve(process.cwd(), settings.name);
	const templateDir = path.join(ROOT, 'templates', settings.language);

	if (fs.existsSync(projectDir)) {
		if (fs.readdirSync(projectDir).length === 0) {
			spinner.info(
				`${chalk.cyan.bold(
					settings.name
				)} exists but is empty. Continuing ...\n`
			);
		} else {
			spinner.stopAndPersist();

			const overwrite = await promptOverwrite(settings.name);

			if (overwrite === 'cancel') {
				spinner.fail('Cancelling installation ...');
				process.exit(0);
			} else if (overwrite === 'clear') {
				spinner.info(
					`Clearing ${chalk.cyan.bold(
						settings.name
					)} and installing discm.js ...\n`
				);

				fs.emptyDirSync(projectDir);
			}
		}
	}

	spinner.start();

	fs.copySync(templateDir, projectDir);

	fs.renameSync(
		path.join(projectDir, '_gitignore'),
		path.join(projectDir, '.gitignore')
	);

	fs.renameSync(
		path.join(projectDir, 'example.config.json'),
		path.join(projectDir, 'config.json')
	);

	if (settings.flags.install) {
		spinner.text = 'Installing dependencies ...';

		try {
			execa(settings.pm, ['install'], { cwd: projectDir });
		} catch (err) {
			logger.error(err);
			spinner.fail('Failed to install dependencies.');
		}

		spinner.succeed('Successfully installed dependencies!');
	}

	if (settings.flags.initGit) {
		spinner.text = 'Initializing github repository ...';

		try {
			execa('git', ['init'], { cwd: projectDir });
		} catch (err) {
			logger.error(err);
			spinner.fail('Failed to initialize repository.');
		}

		spinner.succeed('Successfully initialized repository!');
	}

	spinner.succeed('Finished installing discm.js! Enjoy!');
	process.exit(0);
})();
