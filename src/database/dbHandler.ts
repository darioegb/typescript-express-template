import 'dotenv/config';
import mongoose from 'mongoose';

export class DBHandler {
  public db = mongoose.connection;

  /**
   * Connect to database.
   */
  public async connect() {
    const isTestEnv = process.env.NODE_ENV === 'test';
    if (isTestEnv) {
      process.env.MONGO_PATH = 'admin:REauxJJLZwdDix3@cluster0.ckn76.mongodb.net';
      process.env.MONGO_DATABASE = 'testDB';
    }
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
    const url = isTestEnv
      ? `mongodb+srv://${MONGO_PATH}/${MONGO_DATABASE}?authSource=admin`
      : `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}/${MONGO_DATABASE}?authSource=admin`;
    mongoose
      .connect(url, { ...options })
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
