import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Hand, Send, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface QuickQuestionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const QuickQuestionModal: React.FC<QuickQuestionModalProps> = ({
  open,
  onOpenChange,
}) => {
  const [question, setQuestion] = useState('');
  const [topic, setTopic] = useState('');
  const [anonymous, setAnonymous] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!question.trim()) return;
    
    setSubmitted(true);
    
    setTimeout(() => {
      toast.success('Question submitted!', {
        description: 'Your teacher will see this question.',
      });
      setSubmitted(false);
      setQuestion('');
      setTopic('');
      onOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-8 animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <h3 className="font-display font-semibold text-lg">Question Submitted!</h3>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Your teacher will address your question soon
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Hand className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <DialogTitle className="font-display">Raise Your Hand</DialogTitle>
                  <DialogDescription>
                    Submit a question silently during class
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic (optional)</Label>
                <Select value={topic} onValueChange={setTopic}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select topic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">Current Lesson Topic</SelectItem>
                    <SelectItem value="previous">Previous Topic</SelectItem>
                    <SelectItem value="homework">Homework Related</SelectItem>
                    <SelectItem value="exam">Exam Question</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="question">Your Question</Label>
                <Textarea
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Type your question here... Be as specific as possible."
                  rows={4}
                  className="resize-none"
                />
              </div>

              <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                <div>
                  <Label htmlFor="anonymous" className="font-medium">
                    Submit Anonymously
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Your name won't be shown to the class
                  </p>
                </div>
                <Switch
                  id="anonymous"
                  checked={anonymous}
                  onCheckedChange={setAnonymous}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={!question.trim()}
                className="gap-2 bg-primary hover:bg-primary-dark"
              >
                <Send className="w-4 h-4" />
                Submit Question
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
