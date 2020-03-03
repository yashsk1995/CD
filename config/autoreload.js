module.exports.autoreload = {
  active: true,
  usePolling: false,
  overrideMigrateSetting: false,
  dirs: [
    "api/models",
    "api/controllers",
    "api/policies",
    "api/services",
    "config",
    "assets",
    "views"

  ],
  ignored: [
    // Ignore all files with .ts extension
    "**.ts"
  ]
};
