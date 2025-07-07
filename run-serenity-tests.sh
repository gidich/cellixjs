#!/bin/bash

# Serenity Test Report Viewer
# This script runs tests with Serenity reporting and opens the HTML report

echo "🧪 Running tests with Serenity-JS reporting..."
npm run test:serenity

if [ $? -eq 0 ]; then
    echo "✅ Tests completed!"
    echo "📊 Generating HTML report..."
    npm run serenity:report
    
    if [ $? -eq 0 ]; then
        echo "🎉 Report generated successfully!"
        
        # Check if the report file exists
        REPORT_FILE="packages/api-domain/target/site/serenity/index.html"
        if [ -f "$REPORT_FILE" ]; then
            echo "📋 Report location: $REPORT_FILE"
            
            # Try to open the report in the default browser (macOS)
            if command -v open >/dev/null 2>&1; then
                echo "🌐 Opening report in browser..."
                open "$REPORT_FILE"
            else
                echo "💡 Open the following file in your browser to view the report:"
                echo "   file://$(pwd)/$REPORT_FILE"
            fi
        else
            echo "⚠️  Report file not found at expected location"
        fi
    else
        echo "❌ Failed to generate report"
        exit 1
    fi
else
    echo "❌ Tests failed"
    exit 1
fi
