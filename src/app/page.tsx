'use client';

import * as React from 'react';
import Link from 'next/link'; // Import Link
import { AttendanceRegistration } from '@/components/attendance-registration'; // Import the new component
// import { AttendanceList } from '@/components/attendance-list'; // Remove AttendanceList import
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator'; // Import Separator
import { Button } from '@/components/ui/button'; // Import Button
import { ListChecks, ArrowRight } from 'lucide-react'; // Import icons

export interface AttendanceRecord {
  id: string; // Keep the ID for potential future use (like viewing logs)
  dateTime: string;
  subject: string; // Add subject
  walletAddress: string | null; // Store the wallet address used for registration
}

export default function Home() {
  // Keep state for adding records, but don't display the list here
  const [attendanceRecords, setAttendanceRecords] = useLocalStorage<AttendanceRecord[]>('attendanceRecords', []);
  const { toast } = useToast();

  // Updated function to add a record, now includes subject and wallet address
  const addRecord = (dateTime: string, subject: string, walletAddress: string | null) => {
    const newRecord: AttendanceRecord = {
      id: crypto.randomUUID(), // Generate unique ID for the record itself
      dateTime: dateTime,
      subject: subject,
      walletAddress: walletAddress,
    };
    setAttendanceRecords((prevRecords) => [newRecord, ...prevRecords]); // Add new records to the top
    toast({
      title: "Attendance Registered",
      description: `Attendance for ${getSubjectLabel(subject)} at ${new Date(dateTime).toLocaleString()} marked successfully.`, // Use getSubjectLabel here too
      variant: "default", // Use default style for success
    });
  };

  // Delete record function is removed as the list is not displayed here

  return (
    // Use flex container with flex-col to stack components
    <main className="flex flex-grow flex-col items-center justify-start p-4 sm:p-8 md:p-12 lg:p-16 bg-background space-y-8">
      {/* Render the AttendanceRegistration component */}
      <AttendanceRegistration onSubmit={addRecord} />

      {/* Separator */}
      <Separator className="my-8 w-full max-w-4xl" />

      {/* Attendance Log Link Bar */}
      <div className="w-full max-w-4xl space-y-4">
         {/* Styled Div Bar for Attendance Log Title and Link */}
         <div className="flex items-center justify-between bg-primary text-primary-foreground p-3 rounded-lg shadow">
            <div className="flex items-center gap-2">
                <ListChecks className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Attendance Log</h2>
            </div>
             <Link href="/log" passHref>
                <Button variant="secondary" size="sm" className="bg-white text-primary hover:bg-gray-100">
                   View Full Log <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
             </Link>
         </div>

         {/* The AttendanceList component is removed from this page */}
         {/* <AttendanceList records={attendanceRecords} onDelete={deleteRecord} /> */}
         <p className="text-center text-muted-foreground text-sm">
             Click the button above to view all recorded attendance entries.
         </p>
      </div>
    </main>
  );
}


// Helper function to get subject label (copied from attendance-list for use in toast)
// Keep consistent with the list in attendance-registration.tsx
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
  return subject ? subject.label : value; // Return value itself if not found
}
