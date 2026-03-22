import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { rateLimit } from '@/utils/rate-limiter';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const rateLimitResponse = rateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return Response.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const userId = (session.user as { id?: string }).id;
  const { id } = await params;

  const file = await prisma.savedFile.findFirst({
    where: { id, userId: userId! },
  });

  if (!file) {
    return Response.json(
      { success: false, error: 'File not found' },
      { status: 404 }
    );
  }

  return Response.json({
    success: true,
    file: {
      id: file.id,
      name: file.filename,
      content: file.content,
      createdAt: file.createdAt.toISOString(),
      updatedAt: file.updatedAt.toISOString(),
    },
  });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const rateLimitResponse = rateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return Response.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const userId = (session.user as { id?: string }).id;
  const { id } = await params;

  const existing = await prisma.savedFile.findFirst({
    where: { id, userId: userId! },
  });

  if (!existing) {
    return Response.json(
      { success: false, error: 'File not found' },
      { status: 404 }
    );
  }

  try {
    const body = await request.json();
    const { name, content } = body;

    if (!name && content === undefined) {
      return Response.json(
        { success: false, error: 'At least one field (name or content) is required' },
        { status: 400 }
      );
    }

    const updated = await prisma.savedFile.update({
      where: { id },
      data: {
        ...(name && { filename: name }),
        ...(content !== undefined && { content }),
      },
    });

    return Response.json({
      success: true,
      message: 'File updated successfully',
      file: {
        id: updated.id,
        name: updated.filename,
        updatedAt: updated.updatedAt.toISOString(),
      },
    });
  } catch {
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const rateLimitResponse = rateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return Response.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const userId = (session.user as { id?: string }).id;
  const { id } = await params;

  const existing = await prisma.savedFile.findFirst({
    where: { id, userId: userId! },
  });

  if (!existing) {
    return Response.json(
      { success: false, error: 'File not found' },
      { status: 404 }
    );
  }

  await prisma.savedFile.delete({ where: { id } });

  return Response.json({
    success: true,
    message: 'File deleted successfully',
    deletedFileId: id,
  });
}
