import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { fetchNode, init, initialized } from '@discmjs/docgen';
import type { FetchNodeSuccess } from '@discmjs/docgen';

export const load: PageServerLoad = async ({ params }) => {
	if(!initialized) init();
	
	const result = await fetchNode(params.item,params.type as "classes" | "functions" | "types" | "errors");

	if(!result.success) throw error(404,"Not Found");

	return {
        node: result as FetchNodeSuccess,
		item: params.item,
		type: params.type
	};
};