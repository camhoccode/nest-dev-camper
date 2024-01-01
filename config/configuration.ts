export default () => ({
  port: parseInt(process.env.PORT) || 5000,
  database: {
    uri: process.env.MONGO_URI,
  },
});
