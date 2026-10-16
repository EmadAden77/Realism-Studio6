// All existing Express /api/* handlers are shared with the standalone server.
// Vercel creates a serverless route for each one-segment API endpoint.
import app from '../server';
export default app;
