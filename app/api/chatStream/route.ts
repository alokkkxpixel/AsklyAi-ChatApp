import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // Call OpenRouter API
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo", // or whichever model you’re using
          messages: [{ role: "user", content: message }],
          stream: true,
        }),
      }
    );

    if (!response.body) {
      return NextResponse.json(
        { error: "No response body from OpenRouter" },
        { status: 500 }
      );
    }

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              if (line.includes("[DONE]")) {
                controller.close();
                return;
              }
              try {
                const data = JSON.parse(line.slice(6));
                const content = data.choices?.[0]?.delta?.content || "";
                if (content) {
                  controller.enqueue(
                    `data: ${JSON.stringify({ Content: content })}\n\n`
                  );
                }
              } catch (err) {
                console.error("Parse error:", err);
              }
            }
          }
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
