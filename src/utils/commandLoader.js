const fs = require("node:fs");
const path = require("node:path");

function getCommandFiles(directory) {
  const files = [];

  const entries = fs.readdirSync(directory, {
    withFileTypes: true,
  });

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...getCommandFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".js")) {
      files.push(fullPath);
    }
  }

  return files;
}

module.exports = {
  getCommandFiles,
};
