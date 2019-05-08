#!/bin/bash
if [[ ! -e 'node_modules/' ]]; then
	npm install
else
	
	distDir="assets/dist"
	iconDir="assets/dist/icons"
	
	if [[ ! -e $distDir ]]; then
    	mkdir $distDir
		echo "Created Dist directory..."
	fi

	if [[ ! -e $iconDir ]]; then
    	mkdir $iconDir
		echo "Created Icon directory..."
	fi
	
	echo "Generate Fonts ...."
	icon-font-generator source/icons/stroked-icons/*.svg -o assets/dist/icons/ -n styleguide-icons -p sg-icon

	echo "Running webpack - Woop woop!"
	npm run build

fi

