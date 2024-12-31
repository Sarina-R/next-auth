// import { NextApiResponse } from "next";
// import { PrismaClient } from "@prisma/client";
// import bcrypt from "bcrypt";
// import { NextResponse } from "next/server";

// const prisma = new PrismaClient();

// export async function POST(req: Request, res: NextApiResponse) {
//   console.log(req);
//   if (req.method !== "POST") {
//     return NextResponse.json({ message: "Method not allowed" });
//   }

//   const { email, password } = await req.json();

//   if (!email || !password) {
//     return NextResponse.json({ message: "Email and password are required" });
//   }

//   try {
//     const user = await prisma.user.findUnique({ where: { email } });

//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       return NextResponse.json({ message: "Invalid email or password" });
//     }

//     return NextResponse.json({ message: "Success", user });
//   } catch (error) {
//     return NextResponse.json({ message: "Internal server error" });
//   }

//   return Response.json(req);
// }

import { NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: Request, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { email, password } = await req.json();

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.status(200).json({ message: "Success", user });
  } catch (error) {
    console.error("Error during sign-in:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error?.message });
  }
}
