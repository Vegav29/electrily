const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const port = 3000;

const mongoURL = 'mongodb+srv://vega:vega2003@cluster0.dpfy1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const dbName = 'cluster0';
const collectionName = 'report';

async function fetchData() {
    let client;
    try {
        client = new MongoClient(mongoURL);
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const data = await collection.find({}).toArray();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    } finally {
        if (client) {
            await client.close();
        }
    }
}

app.use(express.static(path.join(__dirname, 'public')));

app.get('/data', async (req, res) => {
    try {
        const data = await fetchData();
        res.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
