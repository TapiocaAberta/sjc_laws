SJC Law scraper
================

You must have to use nodejs version 0.10.x

First, download the dependencies:
	
	npm install

And install MongoDB: 

	sudo apt-get install mongodb

# How to debug:

Run on the terminal:

	node-inspector

In other terminal-tab run the script:

	node --debug-brk crawler.js

Then, go to http://localhost:8080/debug?port=5858

# How to Download the laws:

	wget -m -e robots=off --no-parent http://www.ceaam.net/sjc/legislacao/leis/

## Convert the files to utf-8 before start the script:

	for file in *; do
	    iconv -f WINDOWS-1252 -t utf-8 "$file" -o "${file%.html}.html"
	done

	rm *.htm	