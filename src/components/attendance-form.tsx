
'use client';

import * as React from 'react';
import { useState, useEffect } from 'react'; // Import useEffect
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Lock, Info, Copy } from 'lucide-react'; // Import Info, Copy icons
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast'; // Import useToast

interface AttendanceFormProps {
  onSubmit: (dateTime: string, password?: string) => void; // Update onSubmit signature
}

export function AttendanceForm({ onSubmit }: AttendanceFormProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>(format(new Date(), 'HH:mm'));
  const [password, setPassword] = useState<string>(''); // State for password
  const [generatedId, setGeneratedId] = useState<string>(''); // State for generated ID
  const { toast } = useToast(); // Initialize toast

  // Generate UUID when the component mounts
  useEffect(() => {
    setGeneratedId(crypto.randomUUID());
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedId)
      .then(() => {
        toast({
          title: "ID Copied",
          description: "The unique ID has been copied to your clipboard.",
        });
      })
      .catch(err => {
        console.error('Failed to copy ID: ', err);
         toast({
          title: "Copy Failed",
          description: "Could not copy the ID to clipboard.",
          variant: "destructive",
        });
      });
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date && password) { // Ensure password is provided
      const [hours, minutes] = time.split(':');
      const combinedDateTime = new Date(date);
      combinedDateTime.setHours(parseInt(hours, 10));
      combinedDateTime.setMinutes(parseInt(minutes, 10));
      onSubmit(combinedDateTime.toISOString(), password); // Pass password to onSubmit
      // Optionally clear fields after submission
      // setDate(new Date());
      // setTime(format(new Date(), 'HH:mm'));
      // setPassword('');
      // Optionally generate a new ID after submission
      // setGeneratedId(crypto.randomUUID());
    } else if (!password) {
        // Basic validation feedback - could use form libraries for better UX
         toast({ // Use toast for validation feedback
          title: "Missing Information",
          description: "Please enter the Unique ID (Password).",
          variant: "destructive",
        });
    }
  };

  return (
    <Card className="border-secondary shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl text-foreground">Record Attendance</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date-picker" className="text-muted-foreground">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date-picker"
                  variant={'outline'}
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="time-input" className="text-muted-foreground">Time</Label>
            <div className="relative">
              <Input
                id="time-input"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="pl-10"
                required
              />
               <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
            </div>
          </div>

           {/* Display Generated Unique ID */}
           <div className="space-y-2">
             <Label htmlFor="generated-id-display" className="text-muted-foreground flex items-center">
                <Info className="mr-1 h-4 w-4 text-accent" /> Generated Unique ID
              </Label>
              <div className="flex items-center justify-between p-2 border rounded-md bg-muted/50">
                <code id="generated-id-display" className="text-sm text-foreground break-all select-all">
                  {generatedId}
                </code>
                 <Button
                    type="button" // Prevents form submission
                    variant="ghost"
                    size="icon"
                    onClick={copyToClipboard}
                    className="ml-2 h-7 w-7 text-muted-foreground hover:text-accent-foreground"
                    aria-label="Copy Unique ID"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Use this ID in the field below. Keep it secure.
              </p>
          </div>


          {/* Password Input */}
          <div className="space-y-2">
             <Label htmlFor="password-input" className="text-muted-foreground">Enter Unique ID (Password)</Label>
              <div className="relative">
                  <Input
                  id="password-input"
                  type="password" // Use type="password" to mask input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  placeholder="Enter the generated unique ID here"
                  required
                  />
                   <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
              </div>
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            Submit Attendance
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

