const { stat, readdir, readFile } = require("fs").promises;
const { join } = require("path");

if (process.argv.length < 4) {
  console.log("Not enough arguments provided.");
  process.exit(-1);
}

let searchTerm = new RegExp(process.argv[2]);

for (let arg of process.argv.slice(3)) {
  search(arg);
}

async function search(file) {
  try {
    let stats = await stat(file);
    if (stats.isDirectory()) {
      for (let f of await readdir(file)) {
        await search(join(file, f));
      }
    } else if (searchTerm.test(await readFile(file, "utf-8"))) {
      console.log(file);
    }
  } catch (err) {
    if (err.code !== "ENOENT") console.error(err.message);
    else console.log(`File or directory "${file}" does not exist.`);
  }
}
