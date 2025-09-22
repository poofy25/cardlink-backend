import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
//This import ugly as hell
//Could have been done with ConfigService(alternatively), but the implementation is longer, kind of an overkill

export default () => {
  const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS
    ? process.env.CORS_ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
    : [
        'https://cardneto.link',
        'http://localhost:3000',
        'https://localhost:3000',
      ];

  return {
    methods: process.env.CORS_ALLOWED_METHODS || '*',
    origin: allowedOrigins,
    allowedHeaders: process.env.CORS_ALLOWED_HEADERS || '*',
    credentials: true,
  } as CorsOptions;
};
