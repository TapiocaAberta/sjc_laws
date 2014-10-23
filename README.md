SJC Law scraper
================

## Dependencies:

You must have to use nodejs version 0.10.x

	This script runs only in Linux. Unfortunately, one of the dependencies of html-md (the jsdom library), does not build well on Windows systems since it's built using "native modules" that are compiled during installation.  

## How to Download the laws:

	wget -m -e robots=off --no-parent --reject "index.html*" http://www.ceaam.net/sjc/legislacao/leis/

First of all, download the dependencies:
	
	npm install

And install MongoDB: 

	sudo apt-get install mongodb

## How to debug:

Run on the terminal:

	node-inspector

In other terminal-tab run the script:

	node --debug-brk crawler.js

Then, go to http://localhost:8080/debug?port=5858

## Usefull commands on Mongodb:

	show dbs
	use laws // 	switch between databases.
	show collections
	
	db.laws.findOne() // 	shows the first document saved on database
	db.laws.find().limit(10) // 	limits the query results
	db.laws.find({}, {date : 1}).limit(10) // 	shows only the specified fields
	db.laws.find({"date.year": 2014}).count() // count all laws from 2014
	
	db.laws.distinct("date.year") // distinct of a specific field.
	db.laws.distinct("author") 
	
	Object.keys(db.laws.findOne()) // shows the fields of a document.

## Exports to each year as a file.

	node data_export.js

## All registers as a Mongodb dump in a unique file: 

	mongoexport --db laws --collection laws --out laws.json --journal
