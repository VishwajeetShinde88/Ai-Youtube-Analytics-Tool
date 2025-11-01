import { NextRequest } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    // Get YouTube Video List API
    const result = await axios.get("https://www.googleapis.com/youtube/v3/search", {
      params: {
        part: "snippet",
        q: query,
        type: "video",
        maxResults: 20,
        key: process.env.YOUTUBE_API_KEY,
      },
    });

    const searchData = result.data;
    const videoIds = searchData.items
      .map((item: any) => item.id.videoId)
      .join(",");

    // Get YouTube Video Details by IDs
    const videoResult = await axios.get("https://www.googleapis.com/youtube/v3/videos", {
      params: {
        part: "statistics,snippet",
        id: videoIds, // ✅ Correct param
        key: process.env.YOUTUBE_API_KEY,
      },
    });

    const videoResultData = videoResult.data;
    const FinalResult = videoResultData.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      viewCount: item.statistics.viewCount,
      likeCount: item.statistics.likeCount,
      commentCount: item.statistics.commentCount,
    }));

    return Response.json(FinalResult);
  } catch (error: any) {
    console.error("YouTube API Error:", error.response?.data || error.message);
    return Response.json(
      { error: "Failed to fetch YouTube data" },
      { status: 500 }
    );
  }
}
