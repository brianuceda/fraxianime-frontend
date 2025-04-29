"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Download, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { config } from "@/lib/config";

interface ChapterData {
  chapterInfo: {
    title: string;
    chapter: number;
    animeName: string;
  };
  videoUrl: string;
  downloadLinks: {
    server: string;
    size: string;
    link: string;
  }[];
  animeInfo: {
    title: string;
    image: string;
    chapters: number;
    url: string;
  };
  navigation: {
    previous: {
      number: number;
      link: string;
    } | null;
    next: {
      number: number;
      link: string;
    } | null;
  };
}

export default function ChapterPage() {
  const { animeName, chapter } = useParams<{ animeName: string; chapter: string }>();
  const [chapterData, setChapterData] = useState<ChapterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [videoLoading, setVideoLoading] = useState(true);
  const [directVideoUrl, setDirectVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchChapterData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${config.backendUrl}/anime/${animeName}/${chapter}`);
        if (!response.ok) {
          throw new Error("Failed to fetch chapter data");
        }
        const data = await response.json();
        setChapterData(data);
      } catch (error) {
        console.error("Error fetching chapter data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (animeName && chapter) {
      fetchChapterData();
    }
  }, [animeName, chapter]);

  const handleVideoLoad = () => {
    setVideoLoading(false);
  };

  const formatVideoUrl = (url: string) => {
    // Replace with proxy URL if needed
    if (url && url.includes('jkanime.net')) {
      const proxyBaseUrl = config.backendUrl.replace('/anime', '');
      return `${proxyBaseUrl}/video?url=${encodeURIComponent(url)}`;
    }
    return url;
  };

  const directVideoPlay = (url: string) => {
    // Get direct video URL
    const formattedUrl = formatVideoUrl(url);
    setDirectVideoUrl(formattedUrl);
    window.open(formattedUrl, '_blank');
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 md:px-6 space-y-8">
      {loading ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-9 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-md" />
            </div>
          </div>
          
          <div className="aspect-video bg-card rounded-md overflow-hidden">
            <Skeleton className="h-full w-full" />
          </div>
        </div>
      ) : chapterData ? (
        <>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold">
                {chapterData.animeInfo.title} - Episode {chapterData.chapterInfo.chapter}
              </h1>
              {chapterData.chapterInfo.title && (
                <p className="text-foreground/70 mt-1">{chapterData.chapterInfo.title}</p>
              )}
            </div>
            
            <div className="flex gap-2">
              {chapterData.navigation.previous && (
                <Link href={`/${animeName}/${chapterData.navigation.previous.number}`}>
                  <Button variant="outline" size="icon">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </Link>
              )}
              
              {chapterData.navigation.next && (
                <Link href={`/${animeName}/${chapterData.navigation.next.number}`}>
                  <Button variant="outline" size="icon">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
          
          <Card className="overflow-hidden shadow-lg">
            <CardContent className="p-0">
              <div className="aspect-video relative bg-black">
                {videoLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-card z-10">
                    <div className="text-center">
                      <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
                      <p>Loading video...</p>
                    </div>
                  </div>
                )}
                
                {chapterData.videoUrl ? (
                  <div className="w-full h-full flex items-center justify-center bg-black/90">
                    <div className="text-center px-6">
                      <h3 className="text-lg font-medium mb-4">Due to security restrictions, the video player cannot be embedded.</h3>
                      <p className="mb-6 text-foreground/70">Click the button below to watch the video in a new tab.</p>
                      <Button 
                        onClick={() => directVideoPlay(chapterData.videoUrl)}
                        className="gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Watch Video
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p>Video not available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
            <div>
              <Link href={`/${animeName}`} className="block overflow-hidden rounded-md shadow transition-transform hover:scale-105">
                <img
                  src={chapterData.animeInfo.image || "/placeholder.jpg"}
                  alt={chapterData.animeInfo.title}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </Link>
            </div>
            
            <div className="space-y-6">
              <div>
                <Link href={`/${animeName}`} className="text-xl font-medium hover:text-primary">
                  {chapterData.animeInfo.title}
                </Link>
                <p className="text-sm text-foreground/70 mt-1">
                  {chapterData.animeInfo.chapters ? `${chapterData.animeInfo.chapters} episodes` : "Unknown episodes"}
                </p>
              </div>
              
              <Separator className="my-4" />
              
              {chapterData.downloadLinks?.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Download Options</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {chapterData.downloadLinks.map((link, index) => (
                      <a 
                        key={index}
                        href={link.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2.5 text-xs font-medium rounded-md bg-card hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>
                          {link.server} <span className="opacity-75">({link.size})</span>
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-16 bg-card/30 rounded-lg">
          <h2 className="text-xl font-medium">Episode not found</h2>
          <p className="text-foreground/70 mt-2">The requested episode could not be found.</p>
          <Link href="/" className="inline-block mt-4 text-primary hover:underline">
            Return to home
          </Link>
        </div>
      )}
    </main>
  );
} 