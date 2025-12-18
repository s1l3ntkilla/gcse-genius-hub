import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, KeyRound } from 'lucide-react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { z } from 'zod';

const classCodeSchema = z.string()
  .trim()
  .min(6, 'Class code must be 6 characters')
  .max(6, 'Class code must be 6 characters')
  .regex(/^[A-Z0-9]+$/, 'Class code must contain only uppercase letters and numbers');

interface JoinClassModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const JoinClassModal: React.FC<JoinClassModalProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const { user } = useSupabaseAuth();
  const [classCode, setClassCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate code
    const upperCode = classCode.toUpperCase().trim();
    const validation = classCodeSchema.safeParse(upperCode);
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    setLoading(true);
    try {
      if (!user) {
        setError('You must be signed in to join a class.');
        return;
      }

      const { data, error: invokeError } = await supabase.functions.invoke('join-classroom', {
        body: { code: upperCode },
      });

      if (invokeError) {
        console.error('join-classroom invoke error:', invokeError);
        setError((data as any)?.error || 'Failed to join the class. Please try again.');
        return;
      }

      if (!data?.success) {
        setError(data?.error || 'Invalid class code. Please check and try again.');
        return;
      }

      const classroomName = data.classroom?.name || 'the class';
      if (data.already_member) {
        toast.message(`You're already in ${classroomName}.`);
      } else {
        toast.success(`Successfully joined ${classroomName}!`);
      }

      setClassCode('');
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      console.error('Error joining class:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    setClassCode(value);
    setError('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-primary" />
            Join a Class
          </DialogTitle>
          <DialogDescription>
            Enter the 6-character class code provided by your teacher to join a classroom.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="classCode">Class Code</Label>
            <Input
              id="classCode"
              placeholder="e.g. ABC123"
              value={classCode}
              onChange={handleCodeChange}
              className="text-center text-2xl font-mono tracking-widest uppercase"
              maxLength={6}
              autoComplete="off"
              aria-describedby={error ? 'code-error' : undefined}
            />
            {error && (
              <p id="code-error" className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || classCode.length !== 6}
              className="gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Join Class
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JoinClassModal;