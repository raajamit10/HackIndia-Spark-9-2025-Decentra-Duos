'use client';

import * as React from 'react';
import Link from 'next/link';
import { AttendanceRegistration } from '@/components/attendance-registration';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ListChecks, ArrowRight, CheckSquare } from 'lucide-react'; // Added CheckSquare

export interface AttendanceRecord {
  id: string;
  dateTime: string;
  subject: string;
  password?: string;
  walletAddress: string | null;
  latitude?: number; // Optional: Store location
  longitude?: number; // Optional: Store location
}

// --- Location Configuration ---
const ALLOWED_LOCATION = {
    // Example: Los Angeles City Hall (replace with actual coordinates)
    latitude: 34.0522,
    longitude: -118.2437,
};
const MAX_DISTANCE_KM = 0.25; // 250 meters allowed radius

// --- Helper Functions ---

// Haversine formula to calculate distance between two points on Earth
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Helper function to get subject label
const subjects = [
  { value: 'math-101', label: 'Calculus I' },
  { value: 'phys-202', label: 'Physics for Engineers' },
  { value: 'chem-301', label: 'General Chemistry' },
  { value: 'cs-101', label: 'Intro to Computer Science' },
  { value: 'ee-201', label: 'Circuit Theory I' },
  { value: 'me-301', label: 'Thermodynamics' },
  { value: 'ce-201', label: 'Statics' },
  { value: 'cs-305', label: 'Data Structures & Algorithms' },
  { value: 'ee-302', label: 'Signals and Systems' },
  { value: 'me-302', label: 'Fluid Mechanics' },
  { value: 'ce-302', label: 'Structural Analysis' },
  { value: 'eng-100', label: 'Introduction to Engineering Design' },
];

function getSubjectLabel(value: string): string {
  const subject = subjects.find(s => s.value === value);
  return subject ? subject.label : value;
}


export default function Home() {
  const [attendanceRecords, setAttendanceRecords] = useLocalStorage<AttendanceRecord[]>('attendanceRecords', []);
  const { toast } = useToast();

  // Updated addRecord to accept location and perform validation
  const addRecord = (
    dateTime: string,
    subject: string,
    password: string,
    walletAddress: string | null,
    latitude?: number,
    longitude?: number
  ) => {

    // 1. Location Validation (Client-side - for demo purposes)
    if (latitude === undefined || longitude === undefined) {
        toast({
            title: "Location Missing",
            description: "Could not verify location. Please ensure location services are enabled and permission is granted.",
            variant: "destructive",
        });
        return; // Stop if location is missing
    }

    const distance = getDistanceFromLatLonInKm(
        latitude,
        longitude,
        ALLOWED_LOCATION.latitude,
        longitude,
        ALLOWED_LOCATION.longitude
    );

    console.log(`Distance from allowed location: ${distance.toFixed(4)} km`); // For debugging

    if (distance > MAX_DISTANCE_KM) {
        toast({
            title: "Location Out of Range",
            description: `You must be within ${MAX_DISTANCE_KM * 1000} meters of the allowed location to register attendance.`,
            variant: "destructive",
        });
        return; // Stop if too far
    }

    // 2. If location is valid, create and save the record
    const newRecord: AttendanceRecord = {
      id: crypto.randomUUID(),
      dateTime: dateTime,
      subject: subject,
      password: password,
      walletAddress: walletAddress,
      latitude: latitude, // Save location
      longitude: longitude, // Save location
    };

    setAttendanceRecords((prevRecords) => [newRecord, ...prevRecords]);

    toast({
      title: "Attendance Registered",
      description: `Attendance for ${getSubjectLabel(subject)} at ${new Date(dateTime).toLocaleString()} marked successfully (Location Verified).`,
      variant: "default", // Use default (success) variant
    });
  };

  return (
    // Use flex container with flex-col, center items, and adjust padding
    <main className="flex flex-grow flex-col items-center justify-center p-4 sm:p-8 md:p-12 lg:p-16 bg-background text-center space-y-10">

       {/* Introductory Text */}
       <div className="max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-primary flex items-center justify-center gap-2">
              <CheckSquare className="h-8 w-8" /> BlockAttend
          </h1>
          <p className="text-lg text-muted-foreground">
              Securely register your class attendance using your Ethereum wallet, a daily key, and location verification.
          </p>
        </div>


      {/* Render the AttendanceRegistration component */}
      <AttendanceRegistration onSubmit={addRecord} />

      {/* Separator */}
      <Separator className="my-6 w-full max-w-md" /> {/* Shortened separator */}

      {/* Attendance Log Link Bar */}
      <div className="w-full max-w-lg space-y-4">
         {/* Styled Div Bar for Attendance Log Title and Link */}
         <div className="flex flex-col sm:flex-row items-center justify-between bg-card border border-border p-4 rounded-lg shadow-sm text-left"> {/* Adjusted background and layout */}
            <div className="flex items-center gap-2 mb-3 sm:mb-0">
                <ListChecks className="h-5 w-5 text-primary" />
                <div>
                    <h2 className="text-lg font-semibold text-card-foreground">Attendance Log</h2>
                    <p className="text-sm text-muted-foreground">View all your past entries.</p>
                </div>
            </div>
             <Link href="/log" passHref>
                <Button variant="outline" size="sm" className="w-full sm:w-auto"> {/* Changed variant */}
                   View Full Log <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
             </Link>
         </div>
      </div>
    </main>
  );
}

