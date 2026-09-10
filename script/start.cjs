const fs = require("node:fs");
const path = require("node:path");

// A VPS usa a release publicada. O build local continua funcionando em dist.
const release = path.resolve(__dirname, "../current/index.cjs");
require(fs.existsSync(release) ? release : path.resolve(__dirname, "../dist/index.cjs"));
