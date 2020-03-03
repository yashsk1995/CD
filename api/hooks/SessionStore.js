var MySQLSessionStore = require('express-mysql-session');

module.exports = function setupSessionStore(sails){
  return {
    configure: function(){
      var conn = sails.config.models.connection;

      sails.config.session.store = new MySQLSessionStore({
        host: sails.config.connections[conn].host,
        port: sails.config.connections[conn].port,
        user: sails.config.connections[conn].user,
        password: sails.config.connections[conn].password,
        database: sails.config.connections[conn].database,
        createDatabaseTable: true
      });
    }
  };
};
