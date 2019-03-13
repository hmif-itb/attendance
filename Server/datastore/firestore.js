/**
 * Google Cloud Firestore abstraction
 */
const firestore = require('@google-cloud/firestore');

const db = new firestore({
    projectId: process.env.FIRESTORE_ID,
    keyFilename: process.env.FIRESTORE_KEY,
});

module.exports = db;