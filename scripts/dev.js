const { spawn } = require("node:child_process");
const chokidar = require("chokidar");

let deployProcess = null;
let deployTimer = null;

function deployCommand() {
  if (deployProcess) {
    deployProcess.kill();
  }

  console.log("Deploying commands...");

  deployProcess = spawn("npm", ["run", "deploy"], {
    stdio: "inherit",
    shell: true,
  });

  deployProcess.on("close", (code) => {
    if (code === 0) {
      console.log("Commands deployed successfully.");
    } else {
      console.error(`Deploy process exited with code ${code}.`);
    }

    deployProcess = null;
  });
}

const watcher = chokidar.watch("src/commands/**/*", {
  ignoreInitial: true,
});

watcher.on("all", (event, path) => {
  clearTimeout(deployTimer);
  deployTimer = setTimeout(() => {
    console.log(`Detected ${event} on ${path}. Deploying commands...`);
    deployCommand();
  }, 500);
});

console.log("Watching for command changes...");
