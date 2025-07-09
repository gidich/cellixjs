import { BeforeAll, AfterAll } from '@cucumber/cucumber';
import { configure, Cast } from '@serenity-js/core';
import { SerenityBDDReporter } from '@serenity-js/serenity-bdd';
import { ConsoleReporter } from '@serenity-js/console-reporter';

BeforeAll(() => {
  // Configure Serenity/JS
  configure({
    actors: Cast.where(actor => actor),
    crew: [
      ConsoleReporter.withDefaultColourSupport(),
      SerenityBDDReporter.fromJSON({
        // Configuration options can be added here if needed
      }),
      ['@serenity-js/core:ArtifactArchiver', { outputDirectory: 'target/site/serenity' }],
    ],
  });
});

// Make sure Jest matchers are available  
import { expect as jestExpected } from '@jest/globals';

// Make expect available globally for step definitions
(global as any).expect = jestExpected;
