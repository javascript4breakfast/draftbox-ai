import 'dotenv/config';

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

export const ENV = {
  PORT: Number(process.env.PORT || 3001),
  MOCK: process.env.MOCK === '1',
  GEMINI_API_KEY: process.env.MOCK === '1' ? 'mock-key' : required('GEMINI_API_KEY'),
};