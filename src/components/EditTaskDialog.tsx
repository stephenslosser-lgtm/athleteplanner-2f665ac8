import { useState, useEffect } from 'react';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Task, TaskCategory, CATEGORY_CONFIG } from '@/types/task';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface EditTaskDialogProps {
  task: Task;
  onEdit: (id: string, updates: { title: string; category: TaskCategory; date: string; time?: string }) => void;
}

export function EditTaskDialog({ task, onEdit }: EditTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [category, setCategory] = useState<TaskCategory>(task.category);
  const [date, setDate] = useState(task.date);
  const [time, setTime] = useState(task.time ?? '');

  useEffect(() => {
    if (open) {
      setTitle(task.title);
      setCategory(task.category);
      setDate(task.date);
      setTime(task.time ?? '');
    }
  }, [open, task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onEdit(task.id, { title: title.trim(), category, date, time: time || undefined });
    setOpen(false);
  };

  const categories: TaskCategory[] = ['training', 'academic', 'personal'];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-primary">
          <Pencil className="w-4 h-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display">Edit Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Task title"
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
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Date</label>
            <Input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="bg-secondary border-border"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Time (optional)</label>
            <Input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              className="bg-secondary border-border"
            />
          </div>
          <Button type="submit" className="w-full" disabled={!title.trim()}>
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
