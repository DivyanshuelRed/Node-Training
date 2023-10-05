const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;


let _db;

const mongoConnect =  (cb) =>{
    MongoClient.connect("mongodb+srv://alonesoul2307:YjrGh1IPTIrQ3MUr@cluster0.qiujtss.mongodb.net/?retryWrites=true&w=majority")
    .then(result =>{
        console.log(result);
        _db = result.db()
        cb();
    }). catch(err=>{
        console.log(err);
    })
}

const getDb= () =>{
    if(_db){
        return _db;
    }
    throw "No database found";
}


exports.mongoConnect = mongoConnect;
exports.getDb = getDb;