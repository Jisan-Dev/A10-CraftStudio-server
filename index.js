const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.chn7ebi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const productCollection = client.db('craftDB').collection('products');
    const categoryCollection = client.db('craftDB').collection('categories');

    app.get('/allProducts', async (req, res) => {
      const cursor = productCollection.find();
      const products = await cursor.toArray();
      res.send(products);
    });

    app.get('/categories', async (req, res) => {
      const cursor = categoryCollection.find();
      const categories = await cursor.toArray();
      res.send(categories);
    });
    app.get('/category/:name', async (req, res) => {
      console.log(req.params.name);
      const cursor = productCollection.find({ subcategory_name: req.params.name });
      const categories = await cursor.toArray();
      console.log(categories);
      res.send(categories);
    });

    app.get('/allProducts/:email', async (req, res) => {
      const cursor = productCollection.find({ email: req.params.email });
      const products = await cursor.toArray();
      res.send(products);
    });

    app.get('/productDetails/:id', async (req, res) => {
      const product = await productCollection.findOne({ _id: new ObjectId(req.params.id) });
      res.send(product);
    });

    app.post('/addProduct', async (req, res) => {
      const result = await productCollection.insertOne(req.body);
      res.send(result);
    });

    app.put('/updateProduct/:id', async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      // const result = await productCollection.updateOne(query, { $set: req.body });
      const doc = {
        $set: req.body,
      };
      const result = await productCollection.updateOne(query, doc);
      res.send(result);
    });

    app.delete('/deleteProduct/:id', async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const result = await productCollection.deleteOne(query);
      res.send(result);
    });

    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World! Server Is Running.......');
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
