const mongoose = require('mongoose');

async function connect(connection, logger) {
  logger.log('[DB] - Connecting...');

  const mongoClient = await mongoose
    .connect(connection, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch((error) => {
      logger.log('[DB] - Error while connecting to database', error);
    });

  logger.log('[DB] - Connected');

  return mongoClient;
}

async function close(mongoClient, logger) {
  logger.log('[DB] - Disconnecting...');

  mongoClient
    .connection
    .close()
    .catch((error) => {
      this.logger.log('[DB] - Error while disconnecting to the database', error);
    });

  logger.log('[DB] - Disconnected');
}

module.exports = { connect, close };
