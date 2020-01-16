export default () => ({
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  accessTokenLifetime: process.env.ACCESS_TOKEN_LIFETIME,
  messagesFrequencyLimit: parseInt(process.env.MESSAGES_FREQUENCY_LIMIT, 10),
  database: {
    type: 'mysql',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
    username: process.env.DB_USERNAME || 'default',
    password: process.env.DB_PASSWORD || 'secret',
    database: process.env.DB_NAME || 'ws-chat',
    logging: process.env.DB_LOGGING === 'true' || false,
    synchronize: process.env.DB_SYNCHRONIZE === 'true' || false,
    entities: ['dist/**/*.entity{.ts,.js}'],
  },
});
