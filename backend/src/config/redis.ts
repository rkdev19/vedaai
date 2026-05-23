import IORedis from 'ioredis'

export const redisConnectionConfig = {
  host: 'fond-mosquito-104406.upstash.io',
  port: 6379,
  password: process.env.REDIS_PASSWORD,
  tls: {},
  maxRetriesPerRequest: null as null,
}

const redis = new IORedis(redisConnectionConfig)

redis.on('error', (err) => console.error('Redis error:', err.message))
redis.on('connect', () => console.log('Redis connected'))

export default redis
