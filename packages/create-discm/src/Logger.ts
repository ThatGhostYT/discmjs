import chalk from 'chalk';
import { format } from 'util';

export class Logger {
	public custom(data: any[], color: string) {
		console.log(chalk[color](format(...data)));
	}

	public message(message: string) {
		console.log(
			chalk.bold(
				message.replace(
					/\{(cyan|green|yellow|red):([^}]+)\}/gi,
					(_, color, content) => chalk[color].bold(content)
				)
			)
		);
	}

	public info(...data: any[]) {
		this.custom(data, 'cyan');
	}

	public success(...data: any[]) {
		this.custom(data, 'green');
	}

	public warn(...data: any[]) {
		this.custom(data, 'yellow');
	}

	public error(...data: any[]) {
		this.custom(data, 'red');
	}
}
