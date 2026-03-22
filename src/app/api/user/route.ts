import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { rateLimit } from '@/utils/rate-limiter';

export async function GET(request: Request) {
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
  if (!userId) {
    return Response.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      subscriptionStatus: true,
      createdAt: true,
      _count: { select: { savedFiles: true } },
    },
  });

  if (!user) {
    return Response.json(
      { success: false, error: 'User not found' },
      { status: 404 }
    );
  }

  const maxSavedFiles = user.subscriptionStatus === 'PRO' ? 200 : 5;

  return Response.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      subscription: user.subscriptionStatus.toLowerCase(),
      savedFilesCount: user._count.savedFiles,
      maxSavedFiles,
      createdAt: user.createdAt.toISOString(),
    },
  });
}

export async function PUT(request: Request) {
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
  if (!userId) {
    return Response.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { name, email } = body;

    if (!name && !email) {
      return Response.json(
        { success: false, error: 'At least one field (name or email) is required' },
        { status: 400 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        subscriptionStatus: true,
        _count: { select: { savedFiles: true } },
      },
    });

    const maxSavedFiles = updated.subscriptionStatus === 'PRO' ? 200 : 5;

    return Response.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updated.id,
        email: updated.email,
        name: updated.name,
        subscription: updated.subscriptionStatus.toLowerCase(),
        savedFilesCount: updated._count.savedFiles,
        maxSavedFiles,
      },
    });
  } catch {
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
