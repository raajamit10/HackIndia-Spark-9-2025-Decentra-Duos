'use client';

import * as React from 'react';
import { AttendanceForm } from '@/components/attendance-form';
import { AttendanceList } from '@/components/attendance-list';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast'; // Import useToast

export interface AttendanceRecord {
  id: string;
  dateTime: string;
  password?: string; // Add optional password field
}

export default function Home() {
  const [attendanceRecords, setAttendanceRecords] = useLocalStorage<AttendanceRecord[]>('attendanceRecords', []);
  const { toast } = useToast(); // Initialize toast

  const addRecord = (dateTime: string, password?: string) => {
    // Basic check: Don't add if password is required but not provided (can be enhanced)
    // For this simple case, we'll just store it if provided.
    const newRecord: AttendanceRecord = {
      id: crypto.randomUUID(),
      dateTime: dateTime,
      password: password, // Store the password
    };
    setAttendanceRecords((prevRecords) => [...prevRecords, newRecord]);
    toast({ // Add toast notification
      title: "Attendance Recorded",
      description: `Attendance for ${new Date(dateTime).toLocaleString()} marked successfully.`,
    });
  };

  const deleteRecord = (id: string) => {
    setAttendanceRecords((prevRecords) => prevRecords.filter((record) => record.id !== id));
     toast({ // Add toast notification for deletion
      title: "Record Deleted",
      description: "The attendance record has been removed.",
      variant: "destructive", // Use destructive variant for deletion indication
    });
  };

  return (
    // Removed min-h-screen and added pt-4 to account for navbar height (adjust as needed)
    <main className="flex flex-col items-center p-4 sm:p-8 md:p-12 lg:p-24 bg-secondary">
      <Card className="w-full max-w-2xl shadow-lg rounded-lg mt-4"> {/* Added top margin */}
        <CardHeader className="text-center">
          {/* Removed Blockendance title from here as it's in the navbar */}
          {/* <CardTitle className="text-3xl font-bold text-primary">Blockendance</CardTitle> */}
        </CardHeader>
        <CardContent>
          <AttendanceForm onSubmit={addRecord} />
          <Separator className="my-6" />
          <AttendanceList records={attendanceRecords} onDelete={deleteRecord} />
        </CardContent>
      </Card>
    </main>
  );
}
