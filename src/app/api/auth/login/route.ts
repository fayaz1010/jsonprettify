import { prisma } from "@/lib/db";
import { rateLimit } from '@/utils/rate-limiter';
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const rateLimitResponse = rateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return Response.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return Response.json(
        { success: false, error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.passwordHash) {
      return Response.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      return Response.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    if (!user.isVerified) {
      return Response.json(
        { success: false, error: 'Please verify your email first.' },
        { status: 403 }
      )
    }

    return Response.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        subscription: user.subscriptionStatus.toLowerCase(),
      },
    })
  } catch {
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
