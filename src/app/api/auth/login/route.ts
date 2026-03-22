export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return Response.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Mock authentication — no real database
    if (email === 'test@example.com' && password === 'password123') {
      return Response.json({
        success: true,
        message: 'Login successful',
        user: {
          id: 'user123',
          email: 'test@example.com',
          subscription: 'free',
        },
        token: 'mock-jwt-token-abc123',
      })
    }

    return Response.json(
      { success: false, error: 'Invalid credentials' },
      { status: 401 }
    )
  } catch {
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
