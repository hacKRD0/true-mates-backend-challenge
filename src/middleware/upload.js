// Load modules
const util = require("util");
const Multer = require("multer");

// Defines the max size of a photo that can be uploaded
const maxSize = 2 * 1024 * 1024;
// Configure multer to use Memory Storage Engine
let processFile = Multer({
	storage: Multer.memoryStorage(),
	limits: { fileSize: maxSize },
}).single("file");

// Allows the middleware object to run asynchronously
let processFileMiddleware = util.promisify(processFile);

module.exports = processFileMiddleware;
