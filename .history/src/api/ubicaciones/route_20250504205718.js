// /src/app/api/ubicaciones/route.js
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const data = await req.json();

    const client = await clientPromise;
    const db = client.db("localizatelive");
    const collection = db.collection("ubicaciones");

    const result = await collection.insertOne(data);

    return new Response(
      JSON.stringify({ success: true, id: result.insertedId }),
      {
        status: 201,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
      }
    );
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("localizatelive");
    const ubicaciones = await db
      .collection("ubicaciones")
      .find()
      .sort({ time: -1 })
      .toArray();

    return new Response(JSON.stringify(ubicaciones), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
