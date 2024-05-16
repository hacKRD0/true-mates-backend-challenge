// Load modules
const { Storage } = require("@google-cloud/storage");
const dotenv = require("dotenv").config();

// Initialize GCP storage client
const storage = new Storage({ keyFilename: process.env.GCS_KEYFILE });

console.log(__dirname);
// Assign the GCS bucket to the variable bucket
const bucketName = process.env.GCS_BUCKET;
const bucket = storage.bucket(bucketName);

module.exports = { storage, bucket };
