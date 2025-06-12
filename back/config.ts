export const corsConfig = {
  origin: (origin, cb) => {
    const allowedOrigins = ['http://localhost:3000'];

    if (!origin || allowedOrigins.includes(origin)) cb(null, true);
    else cb(new Error('Not allowed by CORS'), false);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

export const cookieConfig = {
  //cookies config
};