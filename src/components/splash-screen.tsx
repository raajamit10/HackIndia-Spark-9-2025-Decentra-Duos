
'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react'; // Import Loader icon

interface SplashScreenProps {
  children: React.ReactNode;
}

// Duration of the splash screen in milliseconds
const SPLASH_DURATION = 3000; // 3 seconds

export function SplashScreen({ children }: SplashScreenProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, SPLASH_DURATION);

    // Clear the timer if the component unmounts early
    return () => clearTimeout(timer);
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <>
      {isLoading && (
        <div
          className={cn(
            'fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-500 ease-out',
            isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none' // Fade out animation
          )}
        >
          {/*
            Placeholder for the video.
            Replace the <div> tag with a <video> tag once you have a video file.
            Example:
            <video
              src="/splash-video.mp4" // Place your video in the public folder
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
              onEnded={() => setIsLoading(false)} // Optionally end splash when video ends
            />
           */}
           <div className="w-full h-full flex flex-col items-center justify-center bg-primary text-primary-foreground">
             {/* Simple loading indicator */}
             <Loader2 className="h-12 w-12 animate-spin mb-4" />
             <p className="text-xl font-medium animate-pulse">
                Loading...
             </p>
             {/* Or use an actual video tag if you have one */}
             {/*
             <video
                src="/your-video.mp4" // Make sure video is in /public folder
                autoPlay
                muted
                playsInline // Important for mobile browsers
                className="w-full h-full object-cover"
                // You might not need the timer if you use onEnded
                // onEnded={() => setIsLoading(false)}
             />
             */}
           </div>
        </div>
      )}
      {/* Render the actual app content once loading is false */}
      {!isLoading && children}
    </>
  );
}
