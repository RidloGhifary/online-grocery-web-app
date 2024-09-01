import { createClient } from 'redis';

const client = createClient();

client.on('error', (err) => {
  console.error('Redis error =>', err);
});

client.connect().catch((err) => {
  console.error('Failed to connect to Redis =>', err);
});

export default client;
