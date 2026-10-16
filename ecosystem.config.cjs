const fs = require("fs");
const path = require("path");

function loadEnvFile(filePath) {
  const env = {};
  if (!fs.existsSync(filePath)) return env;
  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim().replace(/^\uFEFF/, "");
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const i = trimmed.indexOf("=");
    const key = trimmed.slice(0, i).trim();
    let val = trimmed.slice(i + 1).trim();
    if (
      (val.startsWith("\"") && val.endsWith("\"")) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    env[key] = val;
  }
  return env;
}

const fileEnv = loadEnvFile(path.join(__dirname, ".env"));

module.exports = {
  apps: [
    {
      name: "matcollegewil.co.zw",
      cwd: __dirname,
      script: "./.output/server/index.mjs",
      exec_mode: "cluster",
      instances: 1,
      env: {
        NODE_ENV: "production",
        ...fileEnv,
      },
    },
  ],
};
