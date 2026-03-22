import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return Response.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return Response.json(
        { success: false, error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return Response.json(
        { success: false, error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Note: In production, hash the password before storing.
    // This stores the raw password as passwordHash for demonstration only.
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: password,
      },
    });

    return Response.json(
      {
        success: true,
        message: "Account created successfully",
        user: {
          id: user.id,
          email: user.email,
          name: name || null,
          subscription: user.subscriptionStatus.toLowerCase(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
