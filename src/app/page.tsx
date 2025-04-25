'use client';

import * as React from 'react';
import Link from 'next/link'; // Import Link
import { AttendanceRegistration } from '@/components/attendance-registration'; // Import the new component
import { AttendanceList } from '@/components/attendance-list'; // Import AttendanceList
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
      description: `Attendance for ${subject} at ${new Date(dateTime).toLocaleString()} marked successfully.`,
      variant: "default", // Use default style for success
    });
  };

  // Delete record function
  const deleteRecord = (id: string) => {
    setAttendanceRecords((prevRecords) => prevRecords.filter((record) => record.id !== id));
     toast({
      title: "Record Deleted",
      description: "The attendance record has been removed.",
      variant: "destructive",
    });
  };

  return (
    // Use flex container with flex-col to stack components
    <main className="flex flex-grow flex-col items-center justify-start p-4 sm:p-8 md:p-12 lg:p-16 bg-background space-y-8">
      {/* Render the AttendanceRegistration component */}
      <AttendanceRegistration onSubmit={addRecord} />

      {/* Separator */}
      <Separator className="my-8 w-full max-w-4xl" />

      {/* Attendance Log Section */}
      <div className="w-full max-w-4xl space-y-4">
         {/* Styled Div Bar for Attendance Log Title */}
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

        {/* Render the AttendanceList component */}
        <AttendanceList records={attendanceRecords} onDelete={deleteRecord} />
      </div>
    </main>
  );
}
