import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import serverless from 'serverless-http';
import express from 'express';
import { registerRoutes } from '../../server/routes.js';

const app = express();

// Initialize routes
registerRoutes(app);

// Create serverless handler
const serverlessHandler = serverless(app);

// Export as Netlify function
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const result = await serverlessHandler(event, context);
  return result;
};