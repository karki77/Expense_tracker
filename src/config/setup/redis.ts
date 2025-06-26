import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!, {
  db: 0,
  enableReadyCheck: false,
  maxRetriesPerRequest: 3,
  lazyConnect: true, // Don't connect immediately
});

// Connection event handlers
redis.on('connect', () => {
  console.log('Connected to Redis Cloud');
});

redis.on('error', (error) => {
  console.error('Redis connection error:', error);
});

redis.on('ready', () => {
  console.log('🚀 Redis is ready for operations');
});

export default redis;
