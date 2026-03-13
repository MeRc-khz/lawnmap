import 'dotenv/config';
import { MongoClient } from 'mongodb';
import fs from 'fs';

async function seed() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('lawnczar');
    const collection = db.collection('markers');

    // Clear existing
    await collection.deleteMany({});

    // Load from JSON
    const data = JSON.parse(fs.readFileSync('data/markers.json', 'utf8'));

    // Insert
    const result = await collection.insertMany(data);
    console.log(`${result.insertedCount} markers inserted.`);

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
  }
}

seed();
