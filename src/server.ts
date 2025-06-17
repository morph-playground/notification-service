import { createApp } from './app';

console.log('Starting server...');
const PORT = process.env.PORT || 3000;

const PERMISSION_SERVICE_HOST = process.env.PERMISSION_SERVICE_HOST || 'localhost';
const PERMISSION_SERVICE_PORT = parseInt(process.env.PERMISSION_SERVICE_PORT || '3001', 10);

console.log(`Permission Service Host: ${PERMISSION_SERVICE_HOST}`);
console.log(`Permission Service Port: ${PERMISSION_SERVICE_PORT}`);

const app = createApp({
  host: PERMISSION_SERVICE_HOST,
  port: PERMISSION_SERVICE_PORT
});
console.log('App created, ready to listen...');
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});