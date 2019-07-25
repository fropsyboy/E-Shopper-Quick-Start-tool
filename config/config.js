
const config = {
    appName: process.env.APP_NAME,
    port: process.env.API_PORT,
  
    logging: {
      file: process.env.LOG_PATH,
      level: process.env.LOG_LEVEL || 'warn',
      console: process.env.LOG_ENABLE_CONSOLE || true,
      shouldLogToFile: process.env.IMAGE_EDITOR_ENABLE_FILE_LOGGING || false,
    },
    mongodb: {
      host: process.env.IMAGE_EDITOR_MONGO_HOST,
      username: process.env.IMAGE_EDITOR_MONGO_USER,
      password: process.env.IMAGE_EDITOR_MONGO_PASSWORD,
      port: process.env.IMAGE_EDITOR_MONGO_PORT,
      db: process.env.IMAGE_EDITOR_MONGO_DB_NAME,
      query_limit: process.env.IMAGE_EDITOR_MONGO_QUERY_LIMIT,
    },
    rabbitMQ: {
      host: process.env.IMAGE_EDITOR_RABBIT_HOST,
      port: process.env.IMAGE_EDITOR_RABBIT_PORT,
      user: process.env.IMAGE_EDITOR_RABBIT_USER,
      pass: process.env.IMAGE_EDITOR_RABBIT_PASS,
      queues: {},
    },
    imageSigning: {
      secret: process.env.IMAGE_EDITOR_SECRET,
      algorithm: process.env.IMAGE_EDITOR_ALGORITHM,
    },
  };
  
  module.exports = config;
  