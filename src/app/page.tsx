'use client';

import * as React from 'react';
import { AttendanceRegistration } from '@/components/attendance-registration'; // Import the new component
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useToast } from '@/hooks/use-toast';

export interface AttendanceRecord {
  id: string; // Keep the ID for potential future use (like viewing logs)
  dateTime: string;
  subject: string; // Add subject
  // Password/Key is not stored directly in the record list for this UI,
  // it's used for validation during submission.
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
    setAttendanceRecords((prevRecords) => [...prevRecords, newRecord]);
    toast({
      title: "Attendance Registered",
      description: `Attendance for ${subject} at ${new Date(dateTime).toLocaleString()} marked successfully.`,
      variant: "default", // Use default style for success
    });
  };

  // Delete record function (might be used in a future "Log" page, keep it for now)
  const deleteRecord = (id: string) => {
    setAttendanceRecords((prevRecords) => prevRecords.filter((record) => record.id !== id));
     toast({
      title: "Record Deleted",
      description: "The attendance record has been removed.",
      variant: "destructive",
    });
  };

  return (
    // Use flex container to center the registration card
    <main className="flex flex-grow items-center justify-center p-4 sm:p-8 md:p-12 lg:p-16 bg-background">
      {/* Render the new AttendanceRegistration component */}
      <AttendanceRegistration onSubmit={addRecord} />
      {/*
        The AttendanceList is removed from the main page as per the new UI.
        It could potentially be moved to a separate "/log" page later.
        <AttendanceList records={attendanceRecords} onDelete={deleteRecord} />
       */}
    </main>
  );
}
