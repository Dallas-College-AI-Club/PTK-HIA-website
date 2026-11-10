import { connection } from "next/server";

export async function GET() {
   // Wait for a request so Cache Components cannot prerender the liveness check.
   await connection();

   return Response.json({ status: "ok" }, {
      headers: { "Cache-Control": "no-store" },
   });
}
