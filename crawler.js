// Copyleft 2014 Paulo Luan <https://github.com/transparenciasjc>
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

var md = require('html-md');

var Mongo = require('./mongo.js');

var FileQueue = require('filequeue');
var fq = new FileQueue(10);
var fs = require('fs');
var iconvlite = require('iconv-lite');

var cheerio = require('cheerio');

function clean(array, deleteValue) 
{
	for (var i = 0; i < array.length; i++) {
		if (array[i] == deleteValue) {         
			array.splice(i, 1);
			i--;
		}
	}
};

function parseBodyToJson($) 
{
	var body = $('body').html()
	var completeBody = md(body);

	var resultJson = {
		"completeBody"     : "",
		"author"           : "",
		"name"             : "",
		"description"      : "",
		"lawId"            : "",
		"date"             : {},
		"otherInformations": []
	};

	resultJson.completeBody = completeBody;

	resultJson.author = getAuthorName(completeBody);

	// extract other informations from the page, like the name of the project and the abstract of the law.
	$("script").each(function() {
		var script_text = $(this).html();

		// we need to extract the parameters inside the first tag script, that calls the function XTesta("param1", "param2" ...) in this case, we can compare the char with "x" because it is the first letter of the function
		if(script_text.substring(1, 2).toLowerCase() == "x") {
			var informationsArray = script_text.split('"');

			resultJson.name = informationsArray[1];
			resultJson.description = informationsArray[3];
			resultJson.lawId = informationsArray[7]
			resultJson.date = getDateFromLaw(resultJson.name) //TODO: TESTAR

			// remove all unused informations on array, like commas and null strings
			clean(informationsArray , "");
			clean(informationsArray , ",");

			resultJson.otherInformations = informationsArray.slice(3); // get only informations after the 3rd position.
		}
	});	

	//if(resultJson.author != "") {
	//	return resultJson;
	//}
	return Mongo.save_law(resultJson);
}

function getDateFromLaw(str) {
	var dateJson = {}

	var regex = /(\d{2})\/(\d{2})\/(\d{4})/
	var months = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

	var parts = str.match(regex);

	if(parts) 
	{	
		dateJson.plain = parts[0]; // DD/MM/YYYY
		dateJson.day = parseInt(parts[1]);
		dateJson.month = parseInt(parts[2]);
		dateJson.year = parseInt(parts[3]);
	}

	return dateJson;
}

function getAuthorName(text) {
	var regex = /(.*autoria\s+)(.*)(\).*)/; // regex between "autoria" and ")".
	var matchedText = text.match(regex)
	var newText = "";

	if(matchedText && matchedText.length >= 2) 
	{
		newText = matchedText[2]		
	}

	newText = newText.replace("da Vereadora ", "");
	newText = newText.replace("do Vereador ", "");
	newText = newText.replace("do ", "");
	
	return newText;
}

function scanFiles() 
{
	//var base_dir = require('path').dirname(Object.keys(require.cache)[0]);
	//var dir = "./leis/" + date + "/**/*.html";
	//var dir = base_dir + "//leis//";

	var dir = fs.realpathSync('leis')

	fq.readdir(dir, function(err, dirs) {
		for (var i = 0; i < dirs.length; i++) 
		{
			var subPath = fs.realpathSync(dir + "//" + dirs[i]);
			readDir(subPath);
		};
	});

}

function readDir(dir) 
{
	fq.readdir(dir, function(err, files) {
		if(err) {
		    return console.log(err);
		}

		for (var i = 0; i < files.length; i++) {
			var filePath = fs.realpathSync(dir + "//" + files[i]);
			readFile(filePath);
		};
	});
}

function readFile(filepath) {
    var content = fs.readFileSync(filepath);
    return parseByEnv(iconvlite.decode(content, 'cp1252'));
}

function parseByEnv(content)
{
	var $ = cheerio.load(content, {
	    normalizeWhitespace: true
	});

	parseBodyToJson($);
	
	/*env(content, function (errors, window) {
		if(errors) 
		{
			console.log("Erro: ", errors);
		}

		var $ = require('jquery')(window);
		parseBodyToJson($);
	});*/
}

function initialize()
{
	scanFiles();	
}

Mongo.initialize_db(initialize)