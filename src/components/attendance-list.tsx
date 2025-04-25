
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
import { Card, CardContent } from '@/components/ui/card'; // Removed header imports
import { Trash2, Info } from 'lucide-react'; // Removed ListChecks
import type { AttendanceRecord } from '@/app/page';

interface AttendanceListProps {
  records: AttendanceRecord[];
  onDelete: (id: string) => void;
}

// Helper to find subject label
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


export function AttendanceList({ records, onDelete }: AttendanceListProps) {
  return (
    <Card className="shadow-none rounded-lg border-none bg-transparent"> {/* Removed card styling, make it transparent */}
      <CardContent className="p-0"> {/* Remove card padding */}
        {records.length === 0 ? (
           // No need for the 'no records' message here, it's handled in the LogPage
           null
        ) : (
          <div className="border rounded-lg overflow-hidden"> {/* Added border wrapper */}
            <Table>
                <TableCaption className="py-4">End of attendance records.</TableCaption>
                <TableHeader className="bg-muted/50"> {/* Subtle header background */}
                <TableRow>
                    <TableHead className="w-[35%] sm:w-[30%]">Subject</TableHead>
                    <TableHead className="w-[35%] sm:w-[30%]">Date & Time</TableHead>
                    <TableHead className="hidden sm:table-cell sm:w-[30%]">Wallet Address</TableHead> {/* Hide on small screens */}
                    <TableHead className="text-right w-[10%] sm:w-[10%]">Action</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {records.map((record) => (
                    <TableRow key={record.id} className="hover:bg-muted/30 transition-colors duration-150"> {/* Subtle hover */}
                    <TableCell className="font-medium py-3">{getSubjectLabel(record.subject)}</TableCell>
                    <TableCell className="py-3">{format(new Date(record.dateTime), 'PP p')}</TableCell> {/* Changed format */}
                    <TableCell className="font-mono text-xs truncate max-w-[150px] sm:max-w-none hidden sm:table-cell py-3" title={record.walletAddress ?? 'N/A'}>
                        {record.walletAddress ?? 'N/A'} {/* Show full address on medium+ */}
                    </TableCell>
                    <TableCell className="text-right py-2"> {/* Adjusted padding */}
                        <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(record.id)}
                        className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive h-8 w-8" // Slightly smaller, better hover
                        aria-label="Delete record"
                        >
                        <Trash2 className="h-4 w-4" />
                        </Button>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
