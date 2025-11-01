import React from "react";
import { VideoInfo } from "../page";
import VideoCard from "./VideoCard";

type PROPS = {
  videoList: VideoInfo[] | undefined;
  SearchSimilerThumbnail: (thumbnail: string) => void;
};

function ThumbnailSearchList({ videoList, SearchSimilerThumbnail }: PROPS) {
  if (!videoList || videoList.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10">
        No videos found. Try searching something!
      </div>
    );
  }

  return (
    <div className="mt-7">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {videoList.map((video) => (
          <div
            key={video.id} // ✅ FIXED: key on the outer div
            onClick={() => SearchSimilerThumbnail(video.thumbnail)}
            className="cursor-pointer"
          >
            <VideoCard videoInfo={video} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ThumbnailSearchList;
