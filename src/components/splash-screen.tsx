
'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ArrowRightSquare } from 'lucide-react'; // Using the brand icon from Navbar

interface SplashScreenProps {
  children: React.ReactNode;
}

// Duration of the splash screen in milliseconds
const SPLASH_DURATION = 2500; // 2.5 seconds (adjusted slightly)

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
            'fixed inset-0 z-[100] flex items-center justify-center bg-primary transition-opacity duration-500 ease-out', // Use primary background
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
           <div className="w-full h-full flex flex-col items-center justify-center text-primary-foreground">
             {/* Brand Icon with pulse animation */}
             <ArrowRightSquare className="h-16 w-16 animate-pulse" />

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
