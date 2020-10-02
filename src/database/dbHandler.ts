import 'dotenv/config';
import mongoose from 'mongoose';

export class DBHandler {
  public db = mongoose.connection;

  /**
   * Connect to database.
   */
  public async connect() {
    const isTestEnv = process.env.NODE_ENV === 'test';
    const {
      MONGO_USER,
      MONGO_PASSWORD,
      MONGO_PATH,
      MONGO_DATABASE,
      MONGO_TEST_DATABASE,
    } = process.env;
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    };
    mongoose
      .connect(
        `mongodb://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}/${
          isTestEnv ? MONGO_TEST_DATABASE : MONGO_DATABASE
        }?authSource=admin`,
        { ...options }
      )
      .then(() =>
        !isTestEnv ? console.log('DB: \x1b[32m%s\x1b[0m', 'online') : null
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
