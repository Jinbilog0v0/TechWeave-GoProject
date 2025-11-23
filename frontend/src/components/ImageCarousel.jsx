import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const ImageCarousel = () => {
  const [api, setApi] = useState(null);
  const [current, setCurrent] = useState(0);

  // Placeholder data - replace this with your actual image objects
  const items = [1, 2, 3, 4, 5];

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="w-full flex justify-center py-10">
      <div className="w-full max-w-5xl px-12">
        <Carousel
          setApi={setApi}
          opts={{
            align: "center", 
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4 py-10">
            {items.map((item, index) => {
              const isActive = index === current;
              return (

                <CarouselItem key={index} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3 transition-all duration-300 ease-in-out">
                  <div className={`p-1 transition-all duration-500 ease-in-out ${isActive ? "scale-125 z-10" : "scale-90 opacity-60 grayscale-[0.5]"}`}>
                    <Card className={`shadow-sm transition-shadow duration-300 ${isActive ? "shadow-2xl border-primary/50" : "hover:shadow-md"}`}>
                      <CardContent className="flex aspect-square items-center justify-center p-0 overflow-hidden rounded-lg bg-gray-100 relative group">
                        

                        <div className="flex flex-col items-center justify-center text-gray-400">
                          <span className={`font-semibold transition-all duration-300 ${isActive ? "text-6xl text-primary" : "text-4xl"}`}>
                            {index + 1}
                          </span>
                          <span className="text-sm mt-2">
                                <img />
                          </span>
                        </div>

                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          
          <CarouselPrevious className="h-12 w-12 border-2 -rotate-12 hover:rotate-0 transition-transform duration-300 shadow-md" />
          <CarouselNext className="h-12 w-12 border-2 rotate-12 hover:rotate-0 transition-transform duration-300 shadow-md" />
        </Carousel>
      </div>
    </div>
  );
};

export default ImageCarousel;