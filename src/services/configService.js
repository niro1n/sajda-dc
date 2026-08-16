const fs = require("node:fs");
const path = require("node:path");

const configPath = path.join(__dirname, "../../data/config.json");

function ensureConfigFile() {
  const dir = path.dirname(configPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(
      configPath,
      JSON.stringify({ guilds: {} }, null, 2),
      "utf-8",
    );
  }
}

function readConfig() {
  ensureConfigFile();

  const configData = fs.readFileSync(configPath, "utf-8");

  try {
    return JSON.parse(configData);
  } catch (error) {
    throw new Error("Failed to parse config.json: " + error.message);
  }
}

function saveConfig(config) {
  ensureConfigFile();

  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");
  } catch (error) {
    throw new Error("Failed to write to config.json: " + error.message);
  }
}

function getGuildConfig(guildId) {
  const config = readConfig();
  return config.guilds[guildId] || null;
}

function setGuildConfig(guildId, data = {}) {
  const config = readConfig();

  config.guilds[guildId] = {
    statusChannelId: data.statusChannelId || null,
    reminderChannelId: data.reminderChannelId || null,
    statusMessageId: data.statusMessageId || null,
    location: data.location || null,
    prayer: data.prayer || {
      calculationMethod: "KEMENAG",
    },
  };

  saveConfig(config);

  return config.guilds[guildId];
}

function updateGuildConfig(guildId, updates = {}) {
  const config = readConfig();

  if (!config.guilds[guildId]) {
    config.guilds[guildId] = {};
  }

  config.guilds[guildId] = {
    ...config.guilds[guildId],
    ...updates,
  };

  saveConfig(config);

  return config.guilds[guildId];
}

function deleteGuildConfig(guildId) {
  const config = readConfig();

  delete config.guilds[guildId];
  saveConfig(config);

  return config.guilds[guildId] || null;
}

module.exports = {
  readConfig,
  saveConfig,
  getGuildConfig,
  setGuildConfig,
  updateGuildConfig,
  deleteGuildConfig,
};
