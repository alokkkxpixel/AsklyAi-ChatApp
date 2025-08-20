"use client"

import InfoPopup from "@/components/InfoPopup";
import Navbar from "@/components/Navbar";
import { AiInput } from "@/components/ui/ai-input";
import { useState } from "react";

export default function Home() {

  const [message, setMessage] = useState("")
  const [response, setResponse] = useState("")
  const [streaming, setStreaming] = useState(false)
  const [loading, setLoading] = useState(false)
  const [streamResponse, setStreamResponse] = useState("")






  const handleChat = async ()=>{
      
    setLoading(true)
    setResponse("")

    try {
       
     const res =  await fetch("/api/chat",{
        method:"POST",
        headers: {
          "Content-Type":"application/json"
        },
        body:JSON.stringify({message})
      })
      
      const data = await res.json()
      setResponse(data.response)

    } catch (error) {
      console.log(error)
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
      console.log(errorMessage)
      setResponse("Error: " + errorMessage);
    }
   setLoading(false)
     setMessage("")
  }



const handleStreamChat = async (): Promise<void> => {
  setStreaming(true);
  setStreamResponse("");

  try {
    const res = await fetch("/api/chatStream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = (await reader?.read()) ?? { done: true, value: undefined };

      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = JSON.parse(line.slice(6)) as { Content: string };
          setStreamResponse((prev) => prev + data.Content);
        }
      }
    }
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "Something went wrong";
    console.log(errorMessage);
    setResponse("Error: " + errorMessage);
  }
  setStreaming(false);
 setMessage("")
};



  return (
    <div className="font-sans  bg--400 grid-rows-[20px_1fr_20px] flex flex-col items-center justify-between gap-4 relative">

    <Navbar />
  
  <div className="flex flex-col gap-5 bg--500 items-center justify-center min-h-[60vh]  overflow-hidden">
 <InfoPopup />
{response || streamResponse ? (
  <>
    {response && (
      <div className="md:w-[50vw] w-[90vw] transition-all duration-100 p-4  dark:bg-zinc-800 bg-zinc-300  rounded-sm">
        {response} 
      </div>
    )}

    {streamResponse && (
      <div className="md:w-[50vw] w-[90vw] p-1  dark:bg-zinc-800 bg-zinc-300 rounded-sm">
        <div>
          <h2 className="text-zinc-500">Streaming data</h2>
        </div>
        <div className="p-2">{streamResponse} </div>
      </div>
    )}

    {(loading || streaming) && (
      <div className="text-zinc-400 animate-pulse">AI is thinking...</div>
    )}
  </>
) : (
  <h1 className="text-lg ">What's on your mind today?</h1>
)}

 

  </div>


 
    {/* <textarea value={message} onChange={(e)=> setMessage(e.target.value)}  className="w-[95vw] resize-none bg-zinc-800 outline-none p-2 border border-white/50  rounded-md " placeholder="Ask Anything!!"></textarea> */}
   <div className="w-full ">

    <AiInput message={message} setMessage={setMessage} handleChat={handleChat} handleStreamChat={handleStreamChat} />
   </div>
   <div className=" mx-auto text-center text-xs dark:text-zinc-300  p-2 border-t border-zinc-700">
      <p>
    ⚡ This is a free demo project. Response times may be slower and answers may
    not always be as accurate as ChatGPT.
  </p>
    <h5 className="text-center text-xs text-zinc-700 dark:text-zinc-300  border-zinc-300 dark:border-zinc-700 pt-1">
  © {new Date().getFullYear()} Copyright by{" "}
  <a
    href="https://github.com/alokkkxpixel/"
    target="_blank"
    rel="noopener noreferrer"
    className="text-sky-600 font-semibold hover:underline"
  >
    Alokkkxpixel
  </a>
</h5>

  
 
 
 
    </div>
 
    </div>
  );

}