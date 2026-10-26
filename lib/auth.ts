import jwt from 'jsonwebtoken'

const SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret'

export function signToken(payload: { userId: string; email: string; role: string }) {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): { userId: string; email: string; role: string } | null {
  try {
    return jwt.verify(token, SECRET) as { userId: string; email: string; role: string }
  } catch {
    return null
  }
}
