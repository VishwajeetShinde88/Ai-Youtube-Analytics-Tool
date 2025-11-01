"use client"
import { Button } from '@/components/ui/button';
import { Loader2, Search } from 'lucide-react';
import React, { useState } from 'react'
import axios from 'axios'

function Outlier() {
    const [ userInput,setUserInput]=useState<string>();
    const [loading, setLoading] = useState(false);
    const onSearch=async()=>{
    setLoading(true);
    const result = await axios.get('/api/outlier?query=' + userInput);
    console.log(result.data)
    setLoading(false);
    }
  return (
    
      <div className="px-10 md:px-20 lg:px-40">
        <div className="flex flex-col items-center justify-center mt-20 gap-2">
          <h2 className="font-bold text-4xl">Outlier🔍✨</h2>
          <p className="text-gray-400 text-center">
            Discover thumbnails that match your content using smart AI-powered search.
            Just enter a title or keyword and get visually similar YouTube thumbnails in seconds!
          </p>
        </div>

        <div className="max-w-2xl p-2 border rounded-xl flex gap-2 items-center bg-secondary">
          <input
            type="text"
            value={userInput || ""}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Enter any value to search"
            className="w-full p-2 outline-none bg-transparent"
          />
          <Button onClick={onSearch} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : <Search />}
            Search
          </Button>
        </div>
      </div>
  )
}

export default Outlier
