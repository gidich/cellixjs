# Serenity-JS Test Reporting Setup

## Overview

This project now has Serenity-JS reporting enabled for the `api-domain` package, providing detailed HTML test reports with advanced analytics and test outcome tracking.

## What's Been Configured

### 1. Serenity-JS Packages (Updated to Latest)
- `@serenity-js/core@3.32.3`
- `@serenity-js/serenity-bdd@3.32.3`

### 2. Jest Configuration
- **Root Jest Setup**: `/Volumes/files/src/cellixjs/jest.setupSerenity.ts`
  - Configures Serenity BDD reporter for all tests
  - Works with the workspace structure
- **Package Jest Config**: `/Volumes/files/src/cellixjs/packages/api-domain/jest.config.ts`
  - Inherits from root configuration
  - Includes Serenity setup file

### 3. NPM Scripts (Available from Root)
```bash
# Run tests with Serenity reporting
npm run test:serenity

# Generate HTML report from test results
npm run serenity:report

# Update Serenity CLI jar
npm run serenity:update
```

## Usage

### Running Tests with Serenity
```bash
# From the root of the project
npm run test:serenity
```

This will:
1. Run all tests in the `api-domain` package
2. Generate Serenity JSON reports
3. Update the Serenity CLI jar if needed

### Generating HTML Reports
```bash
# From the root of the project
npm run serenity:report
```

This generates a comprehensive HTML report with:
- Test execution details
- Code coverage statistics
- Interactive charts and graphs
- Test outcome trends

### Viewing Reports
The HTML report is generated at:
```
packages/api-domain/target/site/serenity/index.html
```

You can open this file in any web browser to view the detailed test report.

## Key Features

### ✅ Working
- Serenity-JS integration with Jest
- HTML report generation
- Workspace-aware execution from root
- Updated to latest Serenity-JS version (3.32.3)
- Proper CLI jar download and caching

### 📊 Report Content
- Test execution summaries
- Individual test details
- Code coverage metrics
- Interactive visualizations
- Test outcome history

## File Structure
```
/Volumes/files/src/cellixjs/
├── jest.setupSerenity.ts              # Serenity configuration
├── jest.config.ts                     # Root Jest config
├── package.json                       # Root scripts
└── packages/api-domain/
    ├── jest.config.ts                 # Package Jest config
    ├── package.json                   # Package scripts
    └── target/site/serenity/          # Generated reports
        └── index.html                 # Main report file
```

## Notes

- The setup works with the monorepo workspace structure
- Reports are generated per package (currently `api-domain`)
- Scripts can be run from the project root using npm workspaces
- The Serenity CLI jar is automatically downloaded and cached
