// Call Modules
const path = require('path');

// Third-party Modules
import express, { Express, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';

// required Modules
dotenv.config({ path: './env' });
import ApiError from './utils/ApiError';
import globalErrorHandler from './middlewares/errorMiddleware';
import router from './routes/index';

// express app
const app: Express = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

app.use('/api', router);

// Global error handling middleware
app.use(globalErrorHandler);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

process.on('unhandledRejection', (err: Error) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);

  // Assuming you have a reference to the HTTP server (e.g., 'server') that you want to close gracefully
  if (server) {
    server.close(() => {
      console.error(`Shutting down....`);
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});
