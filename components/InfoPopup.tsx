"use client"
import { useEffect, useState } from "react"

export default function InfoPopup() {
  const [showPopup, setShowPopup] = useState(true)

  useEffect(() => {
    setShowPopup(true) // show when app loads
  }, [])

  if (!showPopup) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="dark:bg-zinc-900/90 bg-zinc-200/80 p-6 rounded-xl shadow-xl w-[90%] max-w-md text-center">
        <h2 className="dark:text-white text-lg font-semibold ">ℹ️ Free Demo Project</h2>
        <h4 className="font-[Skiper1] text-sm font-medium mb-2">Developed by Alokkxpixel</h4>
        <p className="dark:text-zinc-400 text-sm">
          This is a free experimental project. Responses may be slower and not as accurate as ChatGPT.
        </p>
        <button
          onClick={() => setShowPopup(false)}
          className="mt-4 px-4 py-2 bg-zinc-400 dark:bg-zinc-700 hover:bg-zinc-600 dark:text-white rounded-lg transition"
        >
          Got it
        </button>
      </div>
    </div>
  )
}
