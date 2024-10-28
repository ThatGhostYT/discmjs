import enquirer from 'enquirer';
import chalk from 'chalk';
import { readdirSync } from 'fs';
import { Logger } from './Logger.js';

const getCommands = (lang: 'js' | 'ts') =>
	readdirSync(`./templates/commands/${lang}`);

const logger = new Logger();

export async function promptName() {
	const { name } = (await enquirer.prompt({
		type: 'input',
		name: 'name',
		message: 'What would you like to name your project?'
	})) as { name: string };

	logger.info(`Naming the project '${name}'.`);
	return name;
}

export async function promptLanguage() {
	const { language } = (await enquirer.prompt({
		type: 'select',
		name: 'language',
		message: 'Would you like to use typescript or javascript?',
		choices: [
			{ name: 'js', message: 'javascript (js)' },
			{ name: 'ts', message: 'typescript (ts)' }
		]
	})) as { language: 'js' | 'ts' };

	logger.info(
		`Using ${
			language === 'js' ? 'javascript' : 'typescript'
		} for this project!`
	);
	return language;
}

export async function promptManager() {
	const { pm } = (await enquirer.prompt({
		type: 'select',
		name: 'pm',
		message: 'Which package manager would you like to use?',
		choices: ['npm', 'pnpm', 'yarn']
	})) as { pm: 'npm' | 'pnpm' | 'yarn' };

	logger.info(`Using ${pm} for installing.`);
	return pm;
}

export async function promptInstall() {
	const { install } = (await enquirer.prompt({
		type: 'confirm',
		name: 'install',
		message: 'Want us to install dependencies?'
	})) as { install: boolean };

	if (install)
		logger.info('We will start installing those dependencies for you.');
	else
		logger.info(
			'You can always manually install those dependencies later.'
		);

	return install;
}

export async function promptGitInit() {
	const { initGit } = (await enquirer.prompt({
		type: 'confirm',
		name: 'initGit',
		message: 'Would you like us to initialize a github repository?'
	})) as { initGit: boolean };

	if (initGit) logger.info('We will initialize a github repository for you!');
	else
		logger.info(
			'You can always initialize your a github repository yourself later.'
		);

	return initGit;
}

export async function promptOverwrite(app: string) {
	const { overwrite } = (await enquirer.prompt({
		type: 'select',
		name: 'overwrite',
		message: `${chalk.red.bold('Warning:')} ${chalk.cyan.bold(
			app
		)} already exists and is not empty, how would you like to proceed?`,
		choices: [
			{ name: 'cancel', message: 'Cancel installation' },
			{ name: 'overwrite', message: 'Overwrite conflicting files' },
			{ name: 'clear', message: 'Clear the directory' }
		]
	})) as { overwrite: 'clear' | 'overwrite' | 'cancel' };

	return overwrite;
}

export async function promptCommand(lang: 'js' | 'ts') {
	const commands = getCommands(lang);

	const { command } = (await enquirer.prompt({
		type: 'select',
		name: 'command',
		message: 'What template command do you want to copy?',
		choices: commands
	})) as { command: string };

	logger.info(`Templating ${command} command.`);

	return command;
}

export async function promptCopyDir() {
	const { copyDir } = (await enquirer.prompt({
		type: 'input',
		name: 'copyDir',
		message: 'Which directory should we copy the command into?'
	})) as { copyDir: string };

	logger.info(`Copying into ${copyDir}.`);
	return copyDir;
}
