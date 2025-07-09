import { BeforeAll } from '@cucumber/cucumber'
import { configure } from '@serenity-js/core'

BeforeAll(() => {

    // Configure Serenity/JS
    configure({
        crew: [
            '@serenity-js/console-reporter',
            '@serenity-js/serenity-bdd',
            [ '@serenity-js/core:ArtifactArchiver', { outputDirectory: 'target/site/serenity' } ],
            // ... any other reporting services
        ],
    })
})