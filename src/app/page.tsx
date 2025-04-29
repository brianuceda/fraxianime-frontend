"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { config } from "@/lib/config";

interface Anime {
  title: string;
  chapter: number;
  date: string;
  image: string;
  link: string;
}

export default function Home() {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnimes = async () => {
      try {
        const response = await fetch(config.backendUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch animes");
        }
        const data = await response.json();
        setAnimes(data);
      } catch (error) {
        console.error("Error fetching animes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimes();
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 md:px-6">
      <section className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Fraxi Anime
          </h1>
          <p className="text-foreground/70 mt-2">
            Stream the latest anime episodes
          </p>
        </div>
        
        <h2 className="text-2xl font-bold">Latest Episodes</h2>
        
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array(15).fill(0).map((_, index) => (
              <Card key={index} className="overflow-hidden border-border hover:border-primary/50 transition-colors">
                <CardContent className="p-0">
                  <div className="relative">
                    <AspectRatio ratio={2/3}>
                      <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
                    </AspectRatio>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-start p-3 space-y-1.5">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {animes.map((anime, index) => (
              <Link 
                key={index} 
                href={`/${anime.link.split('/').slice(-2)[0]}`} 
                className="group block"
              >
                <Card className="overflow-hidden border-border hover:border-primary/50 transition-colors h-full">
                  <CardContent className="p-0">
                    <div className="relative">
                      <AspectRatio ratio={2/3}>
                        <div className="absolute inset-0 bg-card/20">
                          <img
                            src={anime.image || "/placeholder.jpg"}
                            alt={anime.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                      </AspectRatio>
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded">
                        EP {anime.chapter}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col items-start p-3 space-y-1 h-20">
                    <h3 className="text-sm font-medium line-clamp-2">{anime.title}</h3>
                    <p className="text-xs text-foreground/70">{anime.date}</p>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
