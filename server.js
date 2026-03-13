import 'dotenv/config';
import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

let db;
const client = new MongoClient(uri);

async function connect() {
  try {
    await client.connect();
    db = client.db('lawnczar');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

connect();

app.get('/api/markers', async (req, res) => {
  try {
    const collection = db.collection('markers');
    const markers = await collection.find({}).toArray();
    res.json(markers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// For local development, also serve static files
app.use(express.static('.'));

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/index.html');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
