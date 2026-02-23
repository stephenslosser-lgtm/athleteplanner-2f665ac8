import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TaskCategory, CATEGORY_CONFIG } from '@/types/task';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface AddTaskDialogProps {
  selectedDate: string;
  onAdd: (title: string, category: TaskCategory, date: string, time?: string) => void;
}

export function AddTaskDialog({ selectedDate, onAdd }: AddTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('training');
  const [time, setTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title.trim(), category, selectedDate, time || undefined);
    setTitle('');
    setTime('');
    setOpen(false);
  };

  const categories: TaskCategory[] = ['training', 'academic', 'personal'];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full gap-2 glow-primary">
          <Plus className="w-4 h-4" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display">New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="What do you need to do?"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="bg-secondary border-border"
            autoFocus
          />
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Category</label>
            <div className="flex gap-2">
              {categories.map(cat => {
                const config = CATEGORY_CONFIG[cat];
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all border",
                      category === cat
                        ? "border-primary/50 bg-primary/10 text-foreground"
                        : "border-border bg-secondary/50 text-muted-foreground hover:bg-secondary"
                    )}
                  >
                    <span className={cn("w-2 h-2 rounded-full", config.dotClass)} />
                    {config.label}
                  </button>
                );
              })}
            </div>
          </div>
          <Input
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            className="bg-secondary border-border"
          />
          <Button type="submit" className="w-full" disabled={!title.trim()}>
            Add Task
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
