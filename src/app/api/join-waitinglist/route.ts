import { db } from "@/db";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { drizzle } from 'drizzle-orm/neon-http';

//req is short for request
export async function POST(req: NextRequest) {
    const {email} = await req.json()
    const re = new RegExp("^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$")

    console.log(re.test(email))

    try {

      const res = await db.select().from(users).where(eq(users.email, email));
      console.log(res)

      if (res.length > 0) {
        console.log("already exists")
        return NextResponse.json(
          { message: "User already exists" },
          { status: 500 }
        );
      }

      // insert user
      await db.insert(users).values({ email: email });

      return NextResponse.json(
        { message: "User successfully added" },
        { status: 200 }
      );


    } catch (err){
      console.log(err)
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }

  
}