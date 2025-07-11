import { configure } from '@serenity-js/core';
import { ConsoleReporter } from '@serenity-js/console-reporter';
import { SerenityBDDReporter } from '@serenity-js/serenity-bdd';

// Configure Serenity/JS
configure({
  crew: [
    ConsoleReporter.withDefaultColourSupport(),
    SerenityBDDReporter.fromJSON({}),
  ],
});

export default configure;