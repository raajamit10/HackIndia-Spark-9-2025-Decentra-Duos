
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
import { Card, CardContent } from '@/components/ui/card';
import type { AttendanceRecord } from '@/app/page';
import { MapPin } from 'lucide-react'; // Import MapPin icon
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"; // Import Tooltip components


interface AttendanceListProps {
  records: AttendanceRecord[];
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


export function AttendanceList({ records }: AttendanceListProps) {
  return (
    <TooltipProvider> {/* Wrap with TooltipProvider */}
        <Card className="shadow-none rounded-lg border-none bg-transparent">
        <CardContent className="p-0">
            {records.length === 0 ? (
            null // Handled in LogPage
            ) : (
            <div className="border rounded-lg overflow-hidden">
                <Table>
                <TableCaption className="py-4">End of attendance records.</TableCaption>
                <TableHeader className="bg-muted/50">
                    <TableRow>
                    <TableHead className="w-[35%] sm:w-[30%]">Subject</TableHead> {/* Adjusted width */}
                    <TableHead className="w-[35%] sm:w-[30%]">Date & Time</TableHead> {/* Adjusted width */}
                    <TableHead className="hidden md:table-cell sm:w-[25%]">Wallet Address</TableHead> {/* Hide on small, show on medium+ */}
                    <TableHead className="w-[15%] sm:w-[10%] text-center">Location</TableHead> {/* Added Location column */}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {records.map((record) => (
                    <TableRow key={record.id} className="hover:bg-muted/30 transition-colors duration-150">
                        <TableCell className="font-medium py-3">{getSubjectLabel(record.subject)}</TableCell>
                        <TableCell className="py-3">{format(new Date(record.dateTime), 'PP p')}</TableCell>
                        <TableCell className="font-mono text-xs truncate max-w-[100px] md:max-w-none hidden md:table-cell py-3" title={record.walletAddress ?? 'N/A'}>
                           {record.walletAddress ?? 'N/A'}
                        </TableCell>
                        <TableCell className="py-3 text-center">
                        {record.latitude !== undefined && record.longitude !== undefined ? (
                             <Tooltip>
                                <TooltipTrigger asChild>
                                    <MapPin className="h-4 w-4 text-primary inline-block cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Lat: {record.latitude.toFixed(5)}, Lon: {record.longitude.toFixed(5)}</p>
                                </TooltipContent>
                             </Tooltip>
                        ) : (
                            <span className="text-muted-foreground text-xs">N/A</span>
                        )}
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>
            )}
        </CardContent>
        </Card>
    </TooltipProvider>
  );
}
