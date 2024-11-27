import 'dotenv/config';

export const jwtConstants = {
  secret: process.env.JWT_SECRET,
};

export const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('the mongodb uri is not provided');
  process.exit(1);
}

export const IS_PROD = process.env.APP_ENV == 'production' ? true : false;

export const CLIENT_URL = process.env.CLIENT_URL;

export const PORT = process.env.PORT;
export const IMAGE_PRESET = process.env.IMAGE_PRESET;
