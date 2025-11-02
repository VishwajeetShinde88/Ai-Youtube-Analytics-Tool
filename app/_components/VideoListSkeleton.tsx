import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

function VideoListSkeleton() {
  return (
     <div className="gird grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item, index) => (
        <div key={index} className="flex items-center space-y-3" key={index}>
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default VideoListSkeleton