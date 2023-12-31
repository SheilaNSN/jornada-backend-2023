const { MongoClient, ObjectId } = require("mongodb");
const express = require("express");

// Connection URL
//const url = "mongodb://localhost:27017";

const url = "mongodb+srv://admin:SpO5RvN4FwBwSMSL@cluster0.antlhk0.mongodb.net";
const client = new MongoClient(url);

// Database Name
const dbName = "ocean_jornada_backend_13_06_2023";

async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log("Banco de dados conectado com sucesso!");
  const db = client.db(dbName);
  const collection = db.collection("herois");

  const app = express();

  // Indicamos que o Express deve considerar o Body
  // das requisições como JSON
  app.use(express.json());

  app.get("/", function (req, res) {
    res.send("Hello World");
  });

  app.get("/oi", function (req, res) {
    res.send("Olá, mundo!");
  });

  // Lista de heróis
  const herois = ["Mulher Maravilha", "Capitã Marvel", "Homem de Ferro"];
  //              0                    1                2

  // Read All - [GET] /herois
  app.get("/herois", async function (req, res) {
    const documentos = await collection.find().toArray();
    res.send(documentos);
  });

  // Create - [POST] /herois
  app.post("/herois", async function (req, res) {
    // console.log(req.body, typeof req.body);

    const item = req.body;
    // console.log(nome, typeof nome);

    // herois.push(nome);
    await collection.insertOne(item);

    res.send(item);
  });

  // Read By Id - [GET] /herois/:id
  app.get("/herois/:id", async function (req, res) {
    const id = req.params.id;

    // const item = herois[id - 1];
    const item = await collection.findOne({
      _id: new ObjectId(id),
    });

    res.send(item);
  });

  // Update - [PUT] /herois/:id
  app.put("/herois/:id", async function (req, res) {
    const id = req.params.id;

    // const novoNome = req.body.nome;

    // herois[id - 1] = novoNome;

    const item = req.body;

    await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: item,
      }
    );

    res.send(item);
  });

  // Delete - [DELETE] /herois/:id
  app.delete("/herois/:id", async function (req, res) {
    const id = req.params.id;

    // delete herois[id - 1];
    await collection.deleteOne({
      _id: new ObjectId(id),
    });

    res.send("Item removido com sucesso!");
  });

  app.listen(process.env.PORT || 3000, function () {
    console.log("Aplicação rodando em http://localhost:3000");
  });
}

main();
// .catch(console.error)
// .finally(() => client.close());
