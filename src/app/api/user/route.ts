import { rateLimit } from '@/utils/rate-limiter';

export async function GET(request: Request) {
  const rateLimitResponse = rateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  const authHeader = request.headers.get('authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return Response.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // Mock user profile
  return Response.json({
    success: true,
    user: {
      id: 'user123',
      email: 'test@example.com',
      name: 'Test User',
      subscription: 'free',
      savedFilesCount: 3,
      maxSavedFiles: 5,
      createdAt: '2025-01-15T10:00:00Z',
    },
  })
}

export async function PUT(request: Request) {
  const rateLimitResponse = rateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  const authHeader = request.headers.get('authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return Response.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const { name, email } = body

    if (!name && !email) {
      return Response.json(
        { success: false, error: 'At least one field (name or email) is required' },
        { status: 400 }
      )
    }

    return Response.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: 'user123',
        email: email || 'test@example.com',
        name: name || 'Test User',
        subscription: 'free',
        savedFilesCount: 3,
        maxSavedFiles: 5,
      },
    })
  } catch {
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
