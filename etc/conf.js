var env = require('common-env')(console);

module.exports = env.getOrElseAll({
  API: "http://hastagtropdeswag.cleverapps.io/api"
});
