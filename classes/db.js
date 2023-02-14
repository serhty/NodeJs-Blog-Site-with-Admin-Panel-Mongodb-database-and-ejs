const{MongoClient} = require("mongodb")
const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

class Database{

    async findOne(collectionName,query){
        await client.connect();
        const dbName = await client.db("demo");
        let collection = dbName.collection(collectionName);
        let result = await collection.findOne(query)
        return result;
    }

    async find(collectionName,query){
        await client.connect();
        const dbName = await client.db("demo");
        let collection = dbName.collection(collectionName);
        let result = await collection.find({query}).toArray()
        return result;
    }

    async findQuery(collectionName,query){
        await client.connect();
        var dbName = await client.db("demo");
        let collection = dbName.collection(collectionName);
        let result = await collection.find(query).toArray();
        return result;
    }

    async update(collectionName,query,newValues){
        await client.connect();
        const dbName = await client.db("demo");
        let collection = dbName.collection(collectionName);
        let result = await collection.updateMany(query, newValues)
        return result;
    }

    async addData(collectionName,query){
        await client.connect();
        const dbName = await client.db("demo");
        let collection = dbName.collection(collectionName);
        let result = await collection.insertOne(query)
        return result;
    }

    async deleteOne(collectionName,query){
        await client.connect();
        const dbName = await client.db("demo");
        let collection = dbName.collection(collectionName);
        let result = await collection.deleteOne(query)
        return result;
    }

}

module.exports = Database