import { ConnectionRefusedError, Sequelize } from 'sequelize';
import config from '../config';

const sequelize = new Sequelize(
  config.db.database,
  config.db.username,
  config.db.password,
  {
    host: config.db.host,
    dialect: 'mysql'
  }
);

/**
 * Establishes the connection to the database.
 * 
 * @param reconnectIntervalSeconds How many seconds to retry connecting if connection fails.
 */
async function connect(reconnectIntervalSeconds = 20) {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
  }
  catch (e) {
    if (e instanceof ConnectionRefusedError) {
      console.log(
        `Unable to connect to database '${config.db.database}' at '${config.db.host}'. ` + 
        `Trying again in ${reconnectIntervalSeconds} seconds...`
      );

      await new Promise(r => setTimeout(r, reconnectIntervalSeconds * 1000));
      await connect();
    }
    else {
      throw e;
    }
  }
}

connect();

export default sequelize;