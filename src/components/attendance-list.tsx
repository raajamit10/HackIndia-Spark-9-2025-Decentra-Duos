
'use client';

import React from 'react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trash2, ListChecks, Info } from 'lucide-react'; // Import icons
import type { AttendanceRecord } from '@/app/page'; // Import the interface

interface AttendanceListProps {
  records: AttendanceRecord[];
  onDelete: (id: string) => void;
}

// Helper to find subject label from value (can be moved to a shared util if needed)
// Ensure this list matches the one in attendance-registration.tsx
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


export function AttendanceList({ records, onDelete }: AttendanceListProps) {
  return (
    <Card className="shadow-lg rounded-lg border bg-card text-card-foreground">
      {/* CardHeader removed to match the requested UI in page.tsx */}
      {/* <CardHeader>
        <div className="flex items-center justify-between">
           <CardTitle className="text-xl font-bold flex items-center gap-2">
             <ListChecks className="h-5 w-5 text-primary" /> Attendance Log
           </CardTitle>
        </div>
         <CardDescription>A list of your recent attendance records.</CardDescription>
      </CardHeader> */}
      <CardContent className="pt-4"> {/* Added padding-top since header is removed */}
        {records.length === 0 ? (
           <div className="text-center py-10 text-muted-foreground flex flex-col items-center gap-2">
              <Info className="h-6 w-6" />
              <p>No attendance records found.</p>
              <p className="text-sm">Register your attendance using the form above.</p>
            </div>
        ) : (
          <Table>
            <TableCaption>End of attendance records.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Wallet Address</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{getSubjectLabel(record.subject)}</TableCell>
                  <TableCell>{format(new Date(record.dateTime), 'PPP p')}</TableCell>
                  <TableCell className="font-mono text-xs truncate max-w-[150px] sm:max-w-[200px]" title={record.walletAddress ?? 'N/A'}>
                    {record.walletAddress ? `${record.walletAddress.substring(0, 6)}...${record.walletAddress.substring(record.walletAddress.length - 4)}` : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(record.id)}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Delete record"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
