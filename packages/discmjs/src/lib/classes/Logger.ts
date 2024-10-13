import chalk from 'chalk';
import { format } from 'util';

/**
 * The logger exposed by the discm client.
 */
export class Logger {
	/**
	 * Allows for custom headers.
	 * @param data The data to log.
	 * @param header The header to use for the log message.
	 * @param color The color to print the log message in.
	 */
	public custom(
		data: any[],
		header: string,
		color: 'blue' | 'green' | 'yellow' | 'red' | 'purple'
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
			},
			purple: {
				bg: chalk.bgMagentaBright.bold,
				normal: chalk.magenta
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

	/**
	 * Prints blue text with info header.
	 * @param data The data to log.
	 */
	public info(...data: any[]) {
		this.custom(data, 'info', 'blue');
	}

	/**
	 * Prints green text with success header.
	 * @param data The data to log.
	 */
	public success(...data: any[]) {
		this.custom(data, 'success', 'green');
	}

	/**
	 * Prints yellow text with warn header.
	 * @param data The data to log.
	 */
	public warn(...data: any[]) {
		this.custom(data, 'warn', 'yellow');
	}

	/**
	 * Prints red text with error header.
	 * @param data The data to log.
	 */
	public error(...data: any[]) {
		this.custom(data, 'error', 'red');
	}

	/**
	 * Prints red text with debug header.
	 * @param data The data to log.
	 */
	public debug(...data: any[]) {
		this.custom(data, 'debug', 'purple');
	}

	/**
	 * Prints a custom message that can be change colors within the message base on syntax.
	 * @param message The message to print.
	 */
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
