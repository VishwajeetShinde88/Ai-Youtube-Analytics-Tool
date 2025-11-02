"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { Loader2, Search } from "lucide-react";
import React, { useState } from "react";
import ThumbnailSearchList from "./_components/ThumbnailSearchList";
import { Skeleton } from "@/components/ui/skeleton";
import VideoListSkeleton from "@/app/_components/VideoListSkeleton";

export type VideoInfo = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  viewCount: string;
  likeCount: string;
  commentCount: string;
};

function ThumbnailSearch() {
  const [userInput, setUserInput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [videoList, setVideoList] = useState<VideoInfo[]>();

  // 🔍 Main Search Function
  const onSearch = async () => {
    if (!userInput.trim()) return;
    setLoading(true);
    const result = await axios.get('/api/thumbnail_search?query=' + userInput);
    console.log(result.data)
    setVideoList(result.data);
    setLoading(false);
  };
   // 🧠 New Function: Search by Thumbnail URL
  const SearchSimilerThumbnail = async (url: string) => {
    if (!url.trim()) return;
    setLoading(true);
    try {
      const result = await axios.get(`/api/thumbnail_search?thumbnailUrl=`+url);
      setVideoList(result.data);
    } catch (error) {
      console.error("Error fetching similar thumbnails:", error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div>
      <div className="px-10 md:px-20 lg:px-40">
        <div className="flex flex-col items-center justify-center mt-20 gap-2">
          <h2 className="font-bold text-4xl">AI Thumbnail Search🔍✨</h2>
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
            {loading ? 
           <Loader2 className="animate-spin" /> : <Search />}
            Search
          </Button>
        </div>
      </div>

      

<div>
  {loading ? (
    <div className="gird grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5">
      <VideoListSkeleton/>
    </div>
  ) : (
    // ✅ Correctly render your component when not loading
    <ThumbnailSearchList
      videoList={videoList}
      SearchSimilerThumbnail={(url: string) => SearchSimilerThumbnail(url)}
    />
  )}
</div>


    </div>
  );
}

export default ThumbnailSearch;
