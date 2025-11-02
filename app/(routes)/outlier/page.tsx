"use client"
import { Button } from '@/components/ui/button';
import { Loader2, Search } from 'lucide-react';
import React, { useState } from 'react'
import axios from 'axios'
import { VideoInfo } from '../thumbnail-search/page';
import VideoOutlierCard from '../thumbnail-search/_components/VideoOutlierCard';
import VideoListSkeleton from '@/app/_components/VideoListSkeleton';

export type VideoInfoOutlier = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  smartScore: number;
  viewsPerDay: number;
  isOutlier: boolean;
  engagementRate: number;
  outlierScore: number;
};

function Outlier() {
    const [ userInput,setUserInput]=useState<string>();
    const [loading, setLoading] = useState(false);
    const [videoList,setVideoList]=useState<VideoInfoOutlier[]>();
    const onSearch=async()=>{
      try{
    setLoading(true);
    const result = await axios.get('/api/outlier?query=' + userInput);
    console.log(result.data)
    setVideoList(result.data.videos || []);
    setLoading(false);
      }
      catch(e)
      {
        setLoading(false);
      }
    }
  return (
    <div>
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

      {!loading? <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-7'>
           {  videoList?.map((video,index)=>(
            <div key={index}>
              <VideoOutlierCard videoInfo={video}/>
            </div>
           ))}
      </div>: <VideoListSkeleton/>}

      </div>
  )
}

export default Outlier
