
const MongoClient = require('mongodb').MongoClient;
const uri = ("mongodb+srv://bgajic:KafanaZirafa1!@cluster0-xsmc3.mongodb.net/BazaDB?retryWrites=true");
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  // const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
