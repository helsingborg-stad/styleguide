#!/bin/bash
if [ -d "source/library" ]; then
    echo Library repository already installed in source/library. You might want to add this in your git-client-ui.
else
    if ! (git clone "git@github.com:helsingborg-stad/blade-component-library.git" "source/library") then
        git clone "https://github.com/helsingborg-stad/blade-component-library.git" "source/library"
    fi
fi

mv ./hooks/* ./.git/hooks
rm -rf ./hooks