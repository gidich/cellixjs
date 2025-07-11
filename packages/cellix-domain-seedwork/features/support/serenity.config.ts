import { BeforeAll } from '@cucumber/cucumber';
import { configure } from '@serenity-js/core';

BeforeAll(() => {
  console.log('🔧 Serenity setup loaded');
  
  // Configure Serenity/JS
  configure({
    crew: [
      '@serenity-js/console-reporter',
      '@serenity-js/serenity-bdd',
      [ '@serenity-js/core:ArtifactArchiver', { outputDirectory: 'target/site/serenity' } ],
    ],
  });
});

// Make sure Jest matchers are available  
import { expect as jestExpected } from 'expect';

// Make expect available globally for step definitions
(global as any).expect = jestExpected;
