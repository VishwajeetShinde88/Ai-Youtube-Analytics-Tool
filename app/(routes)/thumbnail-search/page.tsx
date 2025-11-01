"use client"
import { Button } from '@/components/ui/button'
import axios from 'axios';
import { Loader2, Search } from 'lucide-react'
import React, { use, useState } from 'react'
type VideoInfo={
  id:string,
  title:string,
  description:string,
  thumbnail:string,
  channelTitle:string,
  publishedAt:string,
  viewCount:string,
  likeCount:string,
  commentCount:string
}

function ThumbnailSearch() {

  const [userInput,setUserInput] = useState<string>();
  const [loading,setLoading] =useState(false);
  const [videoList,setVideoList]=useState<VideoInfo[]>();
  const onSearch = async() => {
    setLoading(true)
    const result=await axios.get('/api/thumbnail_search?query='+userInput);
    console.log(result.data);
    setLoading(false);
    setVideoList(result.data);
  }
  return (
    <div className=''>
      <div className='px-10 md:px-20 lg:px-40'>
     <div className="flex flex-col items-center justify-center mt-20 gap-2">
          <h2 className="font-bold text-4xl">AI Thumbnail Search🔍✨</h2>
          <p className="text-gray-400 text-center">
            Discover thumbnails that match your content using smart AI-powered search.
            Just enter title or keyword and get visually similar Youtube thumbnails in seconds!
          </p>
        </div>
        <div className='max-w-2xl p-2 border rounded-xl flex gap-2 items-center bg-secondary'>
          <input type ='text' placeholder='Enter any value to search 'className='w-full p-2 outline-none bg-transparent'/>
        <Button onClick={onSearch} disabled={loading }>
          {loading? <Loader2 className='animate-spin'/>: <Search/>}Search</Button>
        </div>
      </div> 
    </div>
  )
}

export default ThumbnailSearch
