export interface CliSettings {
	name: string;
	language: 'js' | 'ts';
	pm: 'npm' | 'pnpm' | 'yarn';
	flags: {
		install: boolean;
		initGit: boolean;
	};
}
