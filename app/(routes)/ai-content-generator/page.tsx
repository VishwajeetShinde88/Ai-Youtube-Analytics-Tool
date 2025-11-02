"use client"
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Loader2, Search, Settings } from "lucide-react";
import React, { useState } from "react";

function AiContentGenerator() {
    const[userInput,setUserInput]=useState<string>();
    const[loading,setLoading]=useState(false);
    const onGenerate=async ()=>{
      
      try{
      setLoading(true);
      const result=await axios.post('/api/ai-content-generator',{
          userInput:userInput
        })
        setLoading(false);

        console.log(result.data);
    }
    catch(e){
setLoading(false);
console.log(e);
    }
  }
    return (
        <div>
              <div className="px-10 md:px-20 lg:px-40">
        <div className="flex flex-col items-center justify-center mt-20 gap-2">
          <h2 className="font-bold text-4xl">AI Content Generator</h2>
          <p className="text-gray-400 text-center">
           Generate enaging Youtube video script,files and descriptions instantly using AI.✨Boost your creativity and content output with smart,data-driven suggestions!🎥🤖
          </p>
        </div>

        <div className="max-w-2xl p-2 border rounded-xl flex gap-2 items-center bg-secondary">
          <input
            type="text"
            value={userInput || ""}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Enter any value to generate content for your next video"
            className="w-full p-2 outline-none bg-transparent"
          />
          <Button onClick={onGenerate} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : <Settings/>}
            Generate
          </Button>
        </div>
      </div>
        </div>
    )
}

export default AiContentGenerator;
