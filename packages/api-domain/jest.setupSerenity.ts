import { configure } from '@serenity-js/core';
import { SerenityBDDReporter } from '@serenity-js/serenity-bdd';

configure({
	crew: [
		new SerenityBDDReporter(),
	],
});
