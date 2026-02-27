#!/bin/bash

# Create symlink to web directory (this needs to be done at runtime since it depends on the workspace path)
echo "Setting up web directory symlink..."
sudo chmod a+x "$(pwd)"
sudo rm -rf /var/www/html
sudo ln -s "$(pwd)" /var/www/html

# Install dependencies and build the styleguide
echo "Install styleguide..."
composer i
npm install
npm run build

echo "Post-create setup complete!"

