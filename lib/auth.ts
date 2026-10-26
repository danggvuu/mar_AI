import jwt from 'jsonwebtoken';

function getJwtSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('[Security] NEXTAUTH_SECRET is required in production environment variables.');
    }
    // Safe random fallback for local dev if not configured
    return 'dev_secret_temporary_key_min_32_characters_long';
  }
  return secret;
}

export function signToken(payload: { userId: string; email: string; role: string }) {
  const secret = getJwtSecret();
  return jwt.sign(payload, secret, { expiresIn: '7d', algorithm: 'HS256' });
}

export function verifyToken(token: string): { userId: string; email: string; role: string } | null {
  try {
    const secret = getJwtSecret();
    return jwt.verify(token, secret, { algorithms: ['HS256'] }) as {
      userId: string;
      email: string;
      role: string;
    };
  } catch {
    return null;
  }
}
