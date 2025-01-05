import { SvelteComponentTyped } from 'svelte';
import type { FetchNodeSuccess } from '@discmjs/docgen';

export class TextGradient extends SvelteComponentTyped<{
	color1: string;
	color2: string;
}> {}

export class HoverTextGradient extends SvelteComponentTyped<{
	color1: string;
	color2: string;
}> {}

export class SpecialBlockquote extends SvelteComponentTyped<{
	type?: 'note' | 'tip' | 'warning';
}> {}

export class Codeblock extends SvelteComponentTyped<{
	language: string;
	disableCopy?: boolean;
}> {}

export class CodeblockTabs extends SvelteComponentTyped<{
	identifier: string;
	names: string[];
	disableCopy?: boolean;
}> {}

export class CodeblockTabOption extends SvelteComponentTyped<{
	identifier: string;
	name: string;
	language: string;
}> {}

export class Card extends SvelteComponentTyped<{
	title: string;
	src?: string;
	alt?: string;
}> {}

export class DocItem extends SvelteComponentTyped<{
	node: FetchNodeSuccess;
	item: string;
	type: string;
}> {}
