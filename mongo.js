var mongoProcessing = require('mongo-cursor-processing')
var dataExport = require('./data_export.js')

// db.laws.ensureIndex( { "lawId": 1 }, { unique: true , dropDups: true} )

// Retrieve
var database;

var collection_name = 'laws';
      
exports.initialize_db = function(callback) {
      var MongoClient = require('mongodb').MongoClient;
            
      MongoClient.connect("mongodb://localhost:27017/laws", function (err, db) {
            if (err) {
                  return console.dir(err);
            }

            database = db;

            callback();
      });    
}

function save_to_db(json, collection_name) {
      if(json) 
      {
            // Connect to the db
            var collection = database.collection(collection_name);
            collection.insert(json, function (err, inserted) {
                  if (err) {
                        console.log(err);
                  } else {
                        console.log("salvo! ", json._id);
                        json = null;
                  }

                  collection = null;
            });
      }
}

exports.save_law = function (law) {
      save_to_db(law, collection_name);
}

exports.exportAllRegistrersByYear = function()
{
      var collection = database.collection(collection_name);
      
      collection.distinct("date.year", function(err, result) {
            return queryAllYears(result);
      });
}

function queryAllYears(years)
{
      var result = {}

      for (var i = 0; i < years.length; i++) {
            proccessYear(years[i]);
      };
}

function proccessYear(year)
{
      var queryObject = {
            "date.year": year
      };

      return queryByYear(queryObject, year);
}

function queryByYear(queryObject, year) {
      var collection = database.collection(collection_name);

      collection.find({"date.year": year}).toArray(function(err, result) {
            var fileName = year + ".json";
            return dataExport.export_to_json_file(result, fileName);      
      });
}

//save_law({"teste": "teste123"});