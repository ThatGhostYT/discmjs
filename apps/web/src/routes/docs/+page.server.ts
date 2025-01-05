import { init, initialized } from '@discmjs/docgen';
import { redirect } from '@sveltejs/kit';

export const load = () => {
    if(!initialized) init();
    throw redirect(302,"/docs/classes/DiscmClient");
};
