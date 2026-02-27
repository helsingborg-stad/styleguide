#!/bin/bash

# Start Apache service
echo "Starting Apache service..."
service apache2 start

if [ $? -eq 0 ]; then
    echo "✅ Apache service started successfully!"
else
    echo -e "${RED}❌ Failed to start Apache service${NC}"
    exit 1
fi