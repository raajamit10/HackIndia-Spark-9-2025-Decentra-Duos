
'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { KeyRound, CalendarDays, Copy, WalletCards, BookOpen, Check, Loader2, AlertCircle, Wallet } from 'lucide-react'; // Added Wallet
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
// Removed useWalletConnection import
import { Skeleton } from '@/components/ui/skeleton';

interface AttendanceRegistrationProps {
  onSubmit: (
    dateTime: string,
    subject: string,
    password: string, // The daily key
    // walletAddress is now fetched from parent/local storage
  ) => void;
  walletAddress: string; // Accept wallet address as a prop
}

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

function generateDailyKey() {
  const datePart = format(new Date(), 'yyyyMMdd');
  const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${datePart}-${randomPart}`;
}


export function AttendanceRegistration({ onSubmit, walletAddress }: AttendanceRegistrationProps) {
  const [dailyKeyInput, setDailyKeyInput] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [todaysGeneratedKey, setTodaysGeneratedKey] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();
  // Removed wallet connection state (account, connectWallet, isWalletLoading, walletError)

  useEffect(() => {
    setTodaysGeneratedKey(generateDailyKey());
  }, []);


  const copyToClipboard = (textToCopy: string, message: string) => {
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        toast({
          title: "Copied to Clipboard",
          description: message,
        });
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
         toast({
          title: "Copy Failed",
          description: "Could not copy the text to clipboard.",
          variant: "destructive",
        });
      });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Wallet Address Check (already passed as prop)
    if (!walletAddress) {
      toast({
        title: "Wallet Not Found",
        description: "Wallet address is missing. Please sign in again.",
        variant: "destructive",
      });
      // Consider redirecting or handling appropriately
      return;
    }

    // 2. Subject Selection Check
    if (!selectedSubject) {
      toast({
        title: "Subject Not Selected",
        description: "Please select a subject.",
        variant: "destructive",
      });
      return;
    }

    // 3. Daily Key Input Check
    if (!dailyKeyInput) {
       toast({
        title: "Daily Key Required",
        description: "Please enter the daily key provided for the class.",
        variant: "destructive",
      });
      return;
    }

    // 4. Validate Daily Key
    if (dailyKeyInput !== todaysGeneratedKey) {
        toast({
            title: "Invalid Daily Key",
            description: "The entered key does not match today's key.",
            variant: "destructive",
        });
        return;
    }


    setIsSubmitting(true);

    try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate submission
        const submissionDateTime = new Date().toISOString();

        // Call the onSubmit prop (walletAddress is now handled by parent)
        onSubmit(
            submissionDateTime,
            selectedSubject,
            dailyKeyInput // The key is used as the password
            // walletAddress is implicitly included via parent's scope
        );

        setSelectedSubject('');
        setDailyKeyInput('');

    } catch (err: any) {
        console.error("Submission error:", err);
        toast({
            title: "Registration Failed",
            description: err.message || "An unexpected error occurred.",
            variant: "destructive",
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-lg shadow-xl rounded-lg border-none bg-card text-card-foreground overflow-hidden">
      <CardHeader className="bg-gradient-to-br from-primary-gradient-start to-primary-gradient-end text-primary-foreground rounded-t-lg p-4 flex flex-row justify-between items-center">
        <CardTitle className="text-lg font-bold">Attendance Registration</CardTitle>
         <KeyRound className="h-5 w-5" />
      </CardHeader>
      <CardContent className="p-6 space-y-6">
         <p className="text-sm text-muted-foreground">
            Your location is verified. Select your subject and enter the daily key to register.
         </p>

        {/* --- Today's Key Display --- */}
        <div className="bg-muted/50 p-4 rounded-md space-y-3 border border-border/50">
           <div className="flex items-center gap-2 text-sm font-medium text-foreground">
             <KeyRound className="h-4 w-4 text-primary"/>
             <span>Today's Key</span>
           </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CalendarDays className="h-3 w-3"/>
              <span>Valid for: {format(new Date(), 'PPP')}</span>
            </div>
           <div className="flex items-center justify-between p-3 border border-dashed border-accent/50 rounded-md bg-background text-accent-foreground">
             <code className="text-lg font-mono font-semibold tracking-wider text-accent">
               {todaysGeneratedKey ? (
                    todaysGeneratedKey
                 ) : (
                     <Skeleton className="h-6 w-32" />
                )}
             </code>
              <Button
                 type="button"
                 variant="ghost"
                 size="icon"
                 onClick={() => copyToClipboard(todaysGeneratedKey, "Today's key copied!")}
                 className="ml-2 h-7 w-7 text-muted-foreground hover:text-accent"
                 aria-label="Copy Today's Key"
                 disabled={!todaysGeneratedKey}
               >
                 <Copy className="h-4 w-4" />
               </Button>
           </div>
        </div>

         {/* --- Wallet Address Display --- */}
        <div className="space-y-2">
             <Label className="text-sm font-medium text-foreground">Registered Wallet Address</Label>
             <div className="flex items-center gap-2 p-3 border rounded-md bg-input text-sm text-muted-foreground">
                 <WalletCards className="h-4 w-4 text-primary" />
                 {walletAddress ? (
                     <span className="truncate font-mono text-foreground flex-1">{walletAddress}</span>
                 ) : (
                     <span className="italic flex-1 text-destructive">Wallet address not found. Please sign in.</span>
                 )}
                 {walletAddress && (
                   <Button
                     type="button"
                     variant="ghost"
                     size="icon"
                     onClick={() => copyToClipboard(walletAddress, "Wallet address copied!")}
                     className="ml-auto h-7 w-7 text-muted-foreground hover:text-primary flex-shrink-0"
                     aria-label="Copy Wallet Address"
                   >
                     <Copy className="h-4 w-4" />
                   </Button>
                 )}
             </div>
             {/* Removed connect wallet button and error display */}
        </div>


        <form onSubmit={handleSubmit} className="space-y-5">
          {/* --- Subject Select --- */}
          <div className="space-y-2">
            <Label htmlFor="subject-select" className="text-sm font-medium text-foreground">Subject</Label>
             <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Select onValueChange={setSelectedSubject} value={selectedSubject} required>
                  <SelectTrigger id="subject-select" className="pl-10 bg-input">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.value} value={subject.value}>
                        {subject.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
             </div>
          </div>

          {/* --- Daily Key Input --- */}
          <div className="space-y-2">
             <Label htmlFor="daily-key-input" className="text-sm font-medium text-foreground">Daily Key</Label>
              <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <Input
                  id="daily-key-input"
                  type="text"
                  value={dailyKeyInput}
                  onChange={(e) => setDailyKeyInput(e.target.value)}
                  className="pl-10 bg-input"
                  placeholder="Enter today's key"
                  required
                  />
              </div>
          </div>

          {/* --- Submit Button --- */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary-gradient-start to-primary-gradient-end text-primary-foreground hover:opacity-90 transition-opacity duration-200"
            disabled={isSubmitting || !walletAddress} // Disable if submitting or wallet address is missing
           >
             {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Check className="mr-2 h-4 w-4" />
             )}
            {isSubmitting ? 'Registering...' : 'Register Attendance'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
