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

  const images = [
    { src: "/Images/carousel1.png", alt: "Dashboard Home" },
    { src: "/Images/carousel2.png", alt: "Personal Workspace" },
    { src: "/Images/carousel3.png", alt: "Collaborative Workspace" },
    { src: "/Images/carousel4.png", alt: "Expense Tracker" },
    { src: "/Images/carousel5.png", alt: "Analytics Dashboard" },
  ];

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
      <div className="w-full max-w-6xl px-4"> 
        <Carousel
          setApi={setApi}
          opts={{
            align: "center",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4 py-10">
            {images.map((image, index) => {
              const isActive = index === current;
              return (
                <CarouselItem
                  key={index}

                  className="pl-4 basis-[85%] md:basis-[70%] lg:basis-[50%] transition-all duration-300 ease-in-out"
                >
                  <div
                    className={`transition-all duration-500 ease-in-out ${
                      isActive ? "scale-110 z-10 opacity-100" : "scale-90 opacity-50 blur-[1px]"
                    }`}
                  >
                    <Card
                      className={`border-0 bg-transparent shadow-none transition-shadow duration-300 ${
                        isActive ? "drop-shadow-2xl" : ""
                      }`}
                    >
                      <CardContent className="flex items-center justify-center p-0 overflow-hidden rounded-xl bg-transparent">
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-auto object-cover rounded-xl shadow-lg border border-gray-100"
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          {/* Nav Buttons */}
          <CarouselPrevious className="hidden md:flex h-12 w-12 border-2 -left-12 bg-white/80 hover:bg-white text-gray-800 shadow-md" />
          <CarouselNext className="hidden md:flex h-12 w-12 border-2 -right-12 bg-white/80 hover:bg-white text-gray-800 shadow-md" />
        </Carousel>
      </div>
    </div>
  );
};

export default ImageCarousel;