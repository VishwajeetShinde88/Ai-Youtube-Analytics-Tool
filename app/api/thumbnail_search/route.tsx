import axios from "axios";

import { NextRequestHint } from "next/dist/server/web/adapter";
import { NextRequest, NextResponse } from "next/server";
import { inngest } from "@/inngest/client";
import { openai } from "inngest";



export async function GET(req: NextRequest){
  const {searchParams} =new URL(req.url);
  const query = searchParams.get('query');
  //const thumbnailUrl=searchParams.get('thumbnailUrl');

  //if(thumbnailUrl){
                async function main() {
              const completion = await openai.chat.completions.create({
                model: 'google/gemini-2.5-flash-image',
                "messages": [
                  {
                    "role": "user",
                    "content": [
                      {
                        "type": "text",
                        "text": "Describe this thumbnail in short keywords suitable for searching similar YouTube videos, Give me tags with comm separated. Do not give any comment text, Maximum 5 tags. Make sure after searching that tags will get similer yotuube thumnails"
                      },
                      {
                        "type": "image_url",
                        "image_url": {
                          "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg"
                        }
                      }
                    ]
                  }
                ]
              });
            }

  //Get Youtube Video List API
   const result = await axios.get("https://www.googleapis.com/youtube/v3/search", {
      params: {
        part: "snippet",
        q: query,
        type: "video",
        maxResults: 20,
        key: process.env.YOUTUBE_API_KEY,
      },
    });
    const searchData=result.data;
    const videoIds = result.data.items.map((item: any) => item.id.videoId).join(",");
    console.log(videoIds)
    const videoResult = await axios.get("https://www.googleapis.com/youtube/v3/videos", {
      params: {
        part: "snippet,statistics",
        id: videoIds,
        key: process.env.YOUTUBE_API_KEY,
      },
    });
    const videoResultData=videoResult.data;
    const finalResult = videoResult.data.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      viewCount: item.statistics?.viewCount || "N/A",
      likeCount: item.statistics?.likeCount || "N/A",
      commentCount: item.statistics?.commentCount || "N/A",
    }));
     return Response.json(finalResult);
  }
    
  
  
    
  
