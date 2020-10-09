import 'dotenv/config';
import mongoose from 'mongoose';

export class DBHandler {
  public db = mongoose.connection;

  /**
   * Connect to database.
   */
  public async connect() {
    const isTestEnv = process.env.NODE_ENV === 'test';
    const isDevEnv = process.env.NODE_ENV === 'dev';
    const {
      MONGO_USER,
      MONGO_PASSWORD,
      MONGO_PATH,
      MONGO_DATABASE,
    } = process.env;
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    };
    const url = `mongodb${
      isDevEnv ? '' : '+srv'
    }://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}/${MONGO_DATABASE}`;
    mongoose
      .connect(url, { ...options })
      .then(() =>
        !isTestEnv ? console.log('DB: %s', 'online'.green) : null
      )
      .catch((error: any) => (!isTestEnv ? console.error(error) : null));
  }

  /**
   * Drop database, close the connection and stop mongod.
   */
  public async close() {
    await this.db.dropDatabase();
    await this.db.close();
  }

  /**
   * Remove all the data for all db collections.
   */
  public async clear() {
    const collections = this.db.collections;

    for (const key of Object.keys(collections)) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  }
}
