#!/bin/bash
if [ -d "source/library" ]; then
    cd ./source/library/ || git pull origin master
    echo Library repository already installed in source/library. You might want to add this in your git-client-ui.
else
    if ! (git clone "git@github.com:helsingborg-stad/component-library.git" "source/library") then
        git clone "https://github.com/helsingborg-stad/component-library.git" "source/library"
    fi
fi