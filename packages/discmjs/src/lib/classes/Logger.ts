import chalk from 'chalk';
import { format } from 'util';

export class Logger {
	public custom(
		data: any[],
		header: string,
		color: 'blue' | 'green' | 'yellow' | 'red'
	) {
		const colors = {
			blue: {
				bg: chalk.bgBlueBright.bold,
				normal: chalk.blue
			},
			green: {
				bg: chalk.bgGreenBright.bold,
				normal: chalk.green
			},
			yellow: {
				bg: chalk.bgYellowBright.bold,
				normal: chalk.yellow
			},
			red: {
				bg: chalk.bgRedBright.bold,
				normal: chalk.red
			}
		};

		const time = new Date();
		let date = chalk.grey(
			`[ ${time.toDateString()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}:${time.getMilliseconds()} ]`
		);
		let title = colors[color].bg(` ${header.toUpperCase()} `);
		let body = colors[color].normal(
			data.map((arg) => format(arg)).join(' ')
		);

		console.log(`${date} ${title} ${body}`);
	}

	public info(...data: any[]) {
		this.custom(data, 'info', 'blue');
	}

	public success(...data: any[]) {
		this.custom(data, 'success', 'green');
	}

	public warn(...data: any[]) {
		this.custom(data, 'warn', 'yellow');
	}

	public error(...data: any[]) {
		this.custom(data, 'error', 'red');
	}

	public message(message: string) {
		console.log(
			chalk.white.bold(
				message.replace(
					/\{(cyan|green|yellow|red):([^}]+)\}/gi,
					(_, color, content) => chalk[color].bold(content)
				)
			)
		);
	}
}
