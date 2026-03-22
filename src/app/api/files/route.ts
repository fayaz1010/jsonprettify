export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return Response.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // Mock saved files list
  return Response.json({
    success: true,
    files: [
      { id: 'file1', name: 'config.json', size: '1KB', createdAt: '2025-03-01T12:00:00Z', updatedAt: '2025-03-10T08:30:00Z' },
      { id: 'file2', name: 'data.json', size: '4KB', createdAt: '2025-03-05T09:15:00Z', updatedAt: '2025-03-05T09:15:00Z' },
      { id: 'file3', name: 'settings.json', size: '2KB', createdAt: '2025-03-12T14:45:00Z', updatedAt: '2025-03-15T16:20:00Z' },
    ],
    total: 3,
    limit: 5,
  })
}

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return Response.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const { name, content } = body

    if (!name) {
      return Response.json(
        { success: false, error: 'File name is required' },
        { status: 400 }
      )
    }

    // Mock: check file limit for free users (5 files max)
    const currentFileCount = 3
    const maxFiles = 5

    if (currentFileCount >= maxFiles) {
      return Response.json(
        {
          success: false,
          error: 'File limit reached. Upgrade to Pro for up to 200 files.',
          currentCount: currentFileCount,
          maxFiles,
        },
        { status: 403 }
      )
    }

    return Response.json(
      {
        success: true,
        message: 'File saved successfully',
        file: {
          id: 'file-' + Date.now(),
          name,
          size: content ? `${new TextEncoder().encode(content).length}B` : '0B',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
      { status: 201 }
    )
  } catch {
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
