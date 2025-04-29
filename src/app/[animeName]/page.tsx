"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";
import { config } from "@/lib/config";

interface AnimeInfo {
  title: string;
  titleEnglish: string;
  description: string;
  image: string;
  info: {
    tipo: string;
    genres: string[];
    studios: string;
    demografia: string;
    idiomas: string;
    episodes: number;
    duracion: string;
    emitido: string;
    estado: string;
  };
  chapters: {
    title: string;
    number: number;
    image: string;
    url: string;
  }[];
  recommendations: {
    title: string;
    image: string;
    url: string;
  }[];
}

export default function AnimePage() {
  const { animeName } = useParams<{ animeName: string }>();
  const [animeInfo, setAnimeInfo] = useState<AnimeInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnimeInfo = async () => {
      try {
        const response = await fetch(`${config.backendUrl}/anime/${animeName}`);
        if (!response.ok) {
          throw new Error("Failed to fetch anime info");
        }
        const data = await response.json();
        setAnimeInfo(data);
      } catch (error) {
        console.error("Error fetching anime info:", error);
      } finally {
        setLoading(false);
      }
    };

    if (animeName) {
      fetchAnimeInfo();
    }
  }, [animeName]);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 md:px-6 space-y-8">
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
          <div className="w-full">
            <AspectRatio ratio={2/3}>
              <Skeleton className="h-full w-full rounded-md" />
            </AspectRatio>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
            <div className="flex flex-wrap gap-2 pt-2">
              {Array(4).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-6 w-20" />
              ))}
            </div>
            <div className="space-y-2 pt-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      ) : animeInfo ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
            <div className="relative w-full overflow-hidden rounded-md shadow-lg">
              <AspectRatio ratio={2/3}>
                <img
                  src={animeInfo.image || "/placeholder.jpg"}
                  alt={animeInfo.title}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </AspectRatio>
            </div>
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">{animeInfo.title}</h1>
                {animeInfo.titleEnglish && (
                  <h2 className="text-xl text-foreground/70 mt-1">{animeInfo.titleEnglish}</h2>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                {animeInfo.info.genres?.map((genre, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 text-xs font-medium rounded-full bg-secondary/10 text-secondary"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">
                {animeInfo.info.tipo && (
                  <div>
                    <span className="block text-foreground/70 mb-1">Type</span>
                    <span className="font-medium">{animeInfo.info.tipo}</span>
                  </div>
                )}
                {animeInfo.info.episodes && (
                  <div>
                    <span className="block text-foreground/70 mb-1">Episodes</span>
                    <span className="font-medium">{animeInfo.info.episodes}</span>
                  </div>
                )}
                {animeInfo.info.estado && (
                  <div>
                    <span className="block text-foreground/70 mb-1">Status</span>
                    <span className="font-medium">{animeInfo.info.estado}</span>
                  </div>
                )}
                {animeInfo.info.studios && (
                  <div>
                    <span className="block text-foreground/70 mb-1">Studio</span>
                    <span className="font-medium">{animeInfo.info.studios}</span>
                  </div>
                )}
                {animeInfo.info.emitido && (
                  <div>
                    <span className="block text-foreground/70 mb-1">Released</span>
                    <span className="font-medium">{animeInfo.info.emitido}</span>
                  </div>
                )}
                {animeInfo.info.demografia && (
                  <div>
                    <span className="block text-foreground/70 mb-1">Demographic</span>
                    <span className="font-medium">{animeInfo.info.demografia}</span>
                  </div>
                )}
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <h3 className="text-lg font-medium mb-3">Synopsis</h3>
                <p className="text-sm leading-relaxed whitespace-pre-line">{animeInfo.description}</p>
              </div>
            </div>
          </div>
          
          <Separator className="my-8" />
          
          <section className="space-y-6">
            <h2 className="text-2xl font-bold">Episodes</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {animeInfo.chapters?.map((chapter) => (
                <Link 
                  key={chapter.number} 
                  href={`/${animeName}/${chapter.number}`}
                  className="group block"
                >
                  <Card className="overflow-hidden border-border hover:border-primary/50 transition-colors h-full">
                    <CardContent className="p-0">
                      <div className="relative">
                        <AspectRatio ratio={16/9}>
                          <div className="absolute inset-0">
                            <img
                              src={chapter.image || "/placeholder-episode.jpg"}
                              alt={`${animeInfo.title} - Episode ${chapter.number}`}
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                              loading="lazy"
                            />
                          </div>
                        </AspectRatio>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="bg-black/60 text-white text-sm font-medium px-3 py-1.5 rounded-full">
                            Episode {chapter.number}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
          
          {animeInfo.recommendations?.length > 0 && (
            <>
              <Separator className="my-8" />
              <section className="space-y-6">
                <h2 className="text-2xl font-bold">Recommendations</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {animeInfo.recommendations.map((recommendation, index) => (
                    <Link 
                      key={index} 
                      href={`/${recommendation.url.split('/').pop()}`}
                      className="group block"
                    >
                      <Card className="overflow-hidden border-border hover:border-primary/50 transition-colors h-full">
                        <CardContent className="p-0">
                          <div className="relative">
                            <AspectRatio ratio={2/3}>
                              <div className="absolute inset-0">
                                <img
                                  src={recommendation.image || "/placeholder.jpg"}
                                  alt={recommendation.title}
                                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                  loading="lazy"
                                />
                              </div>
                            </AspectRatio>
                          </div>
                          <div className="p-2 text-center">
                            <h3 className="text-xs line-clamp-1">{recommendation.title}</h3>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            </>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl">Anime not found</h2>
        </div>
      )}
    </main>
  );
} 