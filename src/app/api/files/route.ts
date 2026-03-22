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
    select: { subscriptionStatus: true },
  });

  const maxFiles = user?.subscriptionStatus === 'PRO' ? 200 : 5;

  const files = await prisma.savedFile.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      filename: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return Response.json({
    success: true,
    files: files.map((f) => ({
      id: f.id,
      name: f.filename,
      createdAt: f.createdAt.toISOString(),
      updatedAt: f.updatedAt.toISOString(),
    })),
    total: files.length,
    limit: maxFiles,
  });
}

export async function POST(request: Request) {
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
    const { name, content } = body;

    if (!name) {
      return Response.json(
        { success: false, error: 'File name is required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { subscriptionStatus: true },
    });

    const maxFiles = user?.subscriptionStatus === 'PRO' ? 200 : 5;

    const currentFileCount = await prisma.savedFile.count({
      where: { userId },
    });

    if (currentFileCount >= maxFiles) {
      return Response.json(
        {
          success: false,
          error: 'File limit reached. Upgrade to Pro for up to 200 files.',
          currentCount: currentFileCount,
          maxFiles,
        },
        { status: 403 }
      );
    }

    const file = await prisma.savedFile.create({
      data: {
        userId,
        filename: name,
        content: content || '',
      },
    });

    return Response.json(
      {
        success: true,
        message: 'File saved successfully',
        file: {
          id: file.id,
          name: file.filename,
          createdAt: file.createdAt.toISOString(),
          updatedAt: file.updatedAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch {
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
