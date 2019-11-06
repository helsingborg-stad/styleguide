#!/bin/bash

# Pull latest sharp library
if [ -d $PWD/source/library ]; then

    echo "Fething latest version of blade component library..."

    cd $PWD/source/library
    git clean -df
    git pull origin master

    echo "Installing required packages..."
    cd $PWD
    npm install

    echo "Building styleguide assets..."
    cd $PWD
    npm run build

else
    sh setup.sh
fi