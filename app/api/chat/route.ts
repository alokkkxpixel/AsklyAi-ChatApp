import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, // use your sk-or-v1 key
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini", // or "deepseek/deepseek-chat"
        messages: [{ role: "user", content: message }],
      }),
    });

    const data = await res.json();

    return NextResponse.json({
      response: data.choices?.[0]?.message?.content || "",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
