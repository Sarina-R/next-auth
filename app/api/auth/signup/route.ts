import { NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request, res: NextApiResponse) {
  if (req.method !== "POST") {
    return NextResponse.json({ message: "Method not allowed" });
  }

  const { email, password } = await req.json();
  console.log({ email, password });

  if (!email || !password) {
    // return res.status(400).json({ message: "Email and password are required" });
    return NextResponse.json({ message: "Email and password are required" });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: "User is not Unique" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
      },
    });
    return NextResponse.json({ message: "hello" });
  } catch (error) {
    return NextResponse.json({ message: "hello" });
  }
}
