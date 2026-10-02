import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import walletRoutes from './routes/walletRoutes';
import swapRoutes from './routes/swapRoutes';
import transactionRoutes from './routes/transactionRoutes';
import aiRoutes from './routes/aiRoutes';
import faucetRoutes from './routes/faucetRoutes';
import { yoga } from './graphql';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middlewares
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows GraphiQL playground in development
  })
);
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(s => s.trim()) 
  : ['http://localhost:3000', 'https://localhost:3000'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes('*') || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive testnet API fallback
    },
    credentials: true,
  })
);
app.use(express.json());

// GraphQL Yoga Endpoint
app.use(yoga.graphqlEndpoint, yoga);

// REST API Endpoints
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/wallet', walletRoutes);
app.use('/api/v1/swap', swapRoutes);
app.use('/api/v1/transaction', transactionRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/faucet', faucetRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'web3service-node',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// Centralized Error Handler
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[web3service-node] REST API: http://localhost:${PORT}/api/v1`);
    console.log(`[web3service-node] GraphQL Playground: http://localhost:${PORT}/graphql`);
  });
}

export default app;
