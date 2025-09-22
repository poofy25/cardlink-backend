import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export default () => {
  const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS
    ? process.env.CORS_ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
    : [
        'https://cardneto.link',
        'http://localhost:3000',
        'https://localhost:3000',
        'https://localhost:8000',
        'http://localhost:8000',
      ];

  return {
    origin: (origin, callback) => {
      console.log('CORS Origin check:', origin);

      // Allow requests with no origin (like mobile apps, Postman, or some browser scenarios)
      if (!origin) {
        console.log('No origin header - allowing request');
        return callback(null, true);
      }

      // Check if origin is in allowed list
      if (allowedOrigins.includes(origin)) {
        console.log('Origin allowed:', origin);
        callback(null, true);
      } else {
        console.log('CORS blocked origin:', origin);
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Accept',
      'Accept-Language',
      'Content-Type',
      'Content-Language',
      'Authorization',
      'Cookie',
      'X-Requested-With',
      'Origin',
      'Referer',
      'User-Agent',
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    preflightContinue: false,
  } as CorsOptions;
};
