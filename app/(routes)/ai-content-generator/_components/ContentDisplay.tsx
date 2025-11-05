import React from "react";
import { Content } from "../page";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

type Props = {
  content: Content | null | undefined;
  loading: boolean;
};

function ContentDisplay({ content, loading }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="w-full h-[200px] rounded-lg" />
        ))}
      </div>
    );
  }

  if (!content) {
    return <p className="text-gray-500">No content available</p>;
  }

  return (
    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Title */}
      <div className="border rounded-xl bg-secondary p-6">
        <h2 className="py-2 text-lg">YouTube Video Title Suggestions</h2>
        {content?.content?.titles?.map((item: any, index: number) => (
          <h2
            key={index}
            className="font-medium flex justify-between items-center"
          >
            {item?.title}
            <span className="p-1 bg-blue-50 text-blue-500 rounded-full font-medium">
              {item?.seo_score}
            </span>
          </h2>
        ))}
      </div>

      {/* Description */}
      <div className="p-6 rounded-xl border">
        <h2 className="py-2 text-lg font-bold">
          YouTube Video Description Suggestion
        </h2>
        <p>{content?.content?.description}</p>
      </div>

      {/* Tags */}
      <div className="p-6 border rounded-xl">
        <h2 className="py-2 text-lg font-bold">YouTube Video Tags</h2>
        {content?.content?.tags?.map((tag: string, index: number) => (
          <Badge variant="secondary" key={index}>
            {tag}
          </Badge>
        ))}
      </div>

      {/* Thumbnail */}
      <div className="p-6 border rounded-xl">
        <h2 className="py-2 text-lg font-bold">YouTube Video Thumbnail</h2>
        {content?.content?.thumbnailUrl ? (
          <Image
            src={content.content.thumbnailUrl}
            width={300}
            height={300}
            className="w-full aspect-video rounded-xl"
            alt="Thumbnail"
          />
        ) : (
          <p className="text-gray-500">No thumbnail available</p>
        )}
      </div>
    </div>
  );
}

export default ContentDisplay;
