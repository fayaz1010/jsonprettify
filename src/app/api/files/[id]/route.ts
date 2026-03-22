import { rateLimit } from '@/utils/rate-limiter';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const rateLimitResponse = rateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  const authHeader = request.headers.get('authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return Response.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const { id } = await params

  // Mock: simulate file not found
  if (id === 'nonexistent') {
    return Response.json(
      { success: false, error: 'File not found' },
      { status: 404 }
    )
  }

  return Response.json({
    success: true,
    file: {
      id,
      name: 'config.json',
      content: '{\n  "key": "value",\n  "nested": {\n    "array": [1, 2, 3]\n  }\n}',
      size: '65B',
      createdAt: '2025-03-01T12:00:00Z',
      updatedAt: '2025-03-10T08:30:00Z',
    },
  })
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const rateLimitResponse = rateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  const authHeader = request.headers.get('authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return Response.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const { id } = await params

  if (id === 'nonexistent') {
    return Response.json(
      { success: false, error: 'File not found' },
      { status: 404 }
    )
  }

  try {
    const body = await request.json()
    const { name, content } = body

    if (!name && !content) {
      return Response.json(
        { success: false, error: 'At least one field (name or content) is required' },
        { status: 400 }
      )
    }

    return Response.json({
      success: true,
      message: 'File updated successfully',
      file: {
        id,
        name: name || 'config.json',
        size: content ? `${new TextEncoder().encode(content).length}B` : '65B',
        updatedAt: new Date().toISOString(),
      },
    })
  } catch {
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const rateLimitResponse = rateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  const authHeader = request.headers.get('authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return Response.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const { id } = await params

  if (id === 'nonexistent') {
    return Response.json(
      { success: false, error: 'File not found' },
      { status: 404 }
    )
  }

  return Response.json({
    success: true,
    message: 'File deleted successfully',
    deletedFileId: id,
  })
}
