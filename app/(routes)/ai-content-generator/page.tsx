"use client"
import { Button } from "@/components/ui/button";
import { RunStatus } from "@/service/GlobalApi";
import axios from "axios";
import { Loader2, Search, Settings } from "lucide-react";
import React, { useState } from "react";
import ContentDisplay from "./_components/ContentDisplay";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

export type Content={
  id:number,
  userInput:string;
  content:subContent
  thumbnailUrl:string,
  createdOn:string
}

export type subContent={
    thumbnailUrl: string | StaticImport;
  description:string,
  image_prompts:any,
  tags:[],
titles:[{
  seo_score:number,
  title:string
  }]
}

function AiContentGenerator() {
    const[userInput,setUserInput]=useState<string>();
    const[loading,setLoading]=useState(false);
    const[content,setContent]=useState<Content>();
const onGenerate = async () => {
  if (!userInput) return;
  setLoading(true);

  try {
    const result = await axios.post('/api/ai-content-generator', { userInput });
    const runId = result.data.runId;  // use the correct runId returned by API
    console.log("Run ID:", runId);

    let runData = null;
    let retries = 0;

    while (retries < 30) {  // poll max 30 times
      const runStatus = await RunStatus(runId);  // <-- use runId here
      if (!runStatus) break;

      if (runStatus.status === "Completed") {
        runData = runStatus.data; // adjust if your API nests it differently
        break;
      }

      if (["Cancelled", "Failed"].includes(runStatus.status)) {
        alert("Thumbnail generation was cancelled or failed.");
        break;
      }

      await new Promise(r => setTimeout(r, 1000));
      retries++;
    }

    if (runData) {
      console.log("Run data:", runData);
      setContent(runData);
    } else {
      console.warn("No run data received");
    }
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

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
      {/*@ts-ignore*/}
      <ContentDisplay content={content} loading={loading}/>
      </div>
    )
}

export default AiContentGenerator;
function setOutputThumbnailImage(output: any) {
  throw new Error("Function not implemented.");
}

