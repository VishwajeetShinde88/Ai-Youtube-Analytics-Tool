import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  try {
    const result = await axios.get("https://www.googleapis.com/youtube/v3/search", {
  params: {
    part: "snippet",
    q: query,
    maxResults: 20,
    type: "video", // ✅ add this
    key: process.env.YOUTUBE_API_KEY,
  },
}); console.log(result.data)

    const videos = result.data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
    }));

    return NextResponse.json(videos);
  } catch (error) {
    console.error("Error fetching from YouTube API:", error);
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
  }
}
