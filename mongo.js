var mongoProcessing = require('mongo-cursor-processing')

// db.laws.ensureIndex( { "lawId": 1 }, { unique: true , dropDups: true} )

// Retrieve
var database;

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
      var collection_name = 'laws'
      save_to_db(law, collection_name);
}

//save_law({"teste": "teste123"});