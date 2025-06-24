import dotenv from 'dotenv';
dotenv.config();
// Load environment variables

export default {
  database: {
    url: process.env.DATABASE_URL,
  },
  redis: {
    url: process.env.REDIS_URL,
  },
  server: {
    port: process.env.PORT || 7000,
  },
  // Add other config settings over here
};
