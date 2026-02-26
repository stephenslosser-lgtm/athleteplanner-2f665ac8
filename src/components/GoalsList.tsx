import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Goal, GoalType } from '@/hooks/useGoals';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Target, Rocket, CalendarIcon, Pencil } from 'lucide-react';

interface GoalsListProps {
  goals: Goal[];
  addGoal: (title: string, type: GoalType, dueDate?: string | null) => void;
  toggleGoal: (id: string) => void;
  deleteGoal: (id: string) => void;
  editGoal: (id: string, updates: { title?: string; type?: GoalType; due_date?: string | null }) => void;
}

export function GoalsList({ goals, addGoal, toggleGoal, deleteGoal, editGoal }: GoalsListProps) {
  const [newTitle, setNewTitle] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [activeTab, setActiveTab] = useState<GoalType>('short_term');

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    addGoal(newTitle.trim(), activeTab, dueDate ? format(dueDate, 'yyyy-MM-dd') : null);
    setNewTitle('');
    setDueDate(undefined);
  };

  const renderGoals = (type: GoalType) => {
    const filtered = goals.filter(g => g.type === type);
    const active = filtered.filter(g => !g.completed);
    const completed = filtered.filter(g => g.completed);

    return (
      <div className="space-y-2">
        {active.length === 0 && completed.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            No {type === 'short_term' ? 'short-term' : 'long-term'} goals yet. Add one below!
          </p>
        )}

        {active.map(goal => (
          <GoalItem key={goal.id} goal={goal} onToggle={toggleGoal} onDelete={deleteGoal} onEdit={editGoal} />
        ))}

        {completed.length > 0 && (
          <>
            <div className="border-t border-border my-3" />
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Completed</p>
            {completed.map(goal => (
              <GoalItem key={goal.id} goal={goal} onToggle={toggleGoal} onDelete={deleteGoal} onEdit={editGoal} />
            ))}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <Tabs value={activeTab} onValueChange={v => setActiveTab(v as GoalType)}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="short_term" className="gap-1.5">
            <Target className="w-3.5 h-3.5" />
            Short Term
          </TabsTrigger>
          <TabsTrigger value="long_term" className="gap-1.5">
            <Rocket className="w-3.5 h-3.5" />
            Long Term
          </TabsTrigger>
        </TabsList>

        <TabsContent value="short_term">{renderGoals('short_term')}</TabsContent>
        <TabsContent value="long_term">{renderGoals('long_term')}</TabsContent>
      </Tabs>

      <div className="flex gap-2 mt-4">
        <Input
          placeholder={`Add a ${activeTab === 'short_term' ? 'short-term' : 'long-term'} goal...`}
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          className="flex-1"
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className={cn("shrink-0 gap-1.5", dueDate && "text-foreground")}>
              <CalendarIcon className="w-3.5 h-3.5" />
              {dueDate ? format(dueDate, 'MMM d') : 'Due'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={setDueDate}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        <Button size="sm" onClick={handleAdd} disabled={!newTitle.trim()}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

function GoalItem({ goal, onToggle, onDelete, onEdit }: {
  goal: Goal;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: { title?: string; type?: GoalType; due_date?: string | null }) => void;
}) {
  const isOverdue = goal.due_date && !goal.completed && new Date(goal.due_date) < new Date(new Date().toISOString().split('T')[0]);

  return (
    <div className={cn(
      "group flex items-center gap-3 p-3 rounded-lg transition-all",
      goal.completed ? "bg-secondary/40 opacity-50" : "bg-secondary/60 hover:bg-secondary/80"
    )}>
      <Checkbox
        checked={goal.completed}
        onCheckedChange={() => onToggle(goal.id)}
        className={cn("border-muted-foreground", goal.completed && "data-[state=checked]:bg-primary data-[state=checked]:border-primary")}
      />
      <div className="flex-1 min-w-0">
        <span className={cn("text-sm block", goal.completed && "line-through text-muted-foreground")}>
          {goal.title}
        </span>
        {goal.due_date && (
          <span className={cn(
            "text-xs",
            isOverdue ? "text-destructive" : "text-muted-foreground"
          )}>
            Due {format(new Date(goal.due_date + 'T00:00:00'), 'MMM d, yyyy')}
          </span>
        )}
      </div>
      <EditGoalDialog goal={goal} onEdit={onEdit} />
      <button
        onClick={() => onDelete(goal.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-destructive"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

function EditGoalDialog({ goal, onEdit }: {
  goal: Goal;
  onEdit: (id: string, updates: { title?: string; type?: GoalType; due_date?: string | null }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(goal.title);
  const [type, setType] = useState<GoalType>(goal.type);
  const [dueDate, setDueDate] = useState<Date | undefined>(goal.due_date ? new Date(goal.due_date + 'T00:00:00') : undefined);

  useEffect(() => {
    if (open) {
      setTitle(goal.title);
      setType(goal.type);
      setDueDate(goal.due_date ? new Date(goal.due_date + 'T00:00:00') : undefined);
    }
  }, [open, goal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onEdit(goal.id, {
      title: title.trim(),
      type,
      due_date: dueDate ? format(dueDate, 'yyyy-MM-dd') : null,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-primary">
          <Pencil className="w-4 h-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display">Edit Goal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Goal title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="bg-secondary border-border"
            autoFocus
          />
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Type</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setType('short_term')}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all border",
                  type === 'short_term'
                    ? "border-primary/50 bg-primary/10 text-foreground"
                    : "border-border bg-secondary/50 text-muted-foreground hover:bg-secondary"
                )}
              >
                <Target className="w-3.5 h-3.5" /> Short Term
              </button>
              <button
                type="button"
                onClick={() => setType('long_term')}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all border",
                  type === 'long_term'
                    ? "border-primary/50 bg-primary/10 text-foreground"
                    : "border-border bg-secondary/50 text-muted-foreground hover:bg-secondary"
                )}
              >
                <Rocket className="w-3.5 h-3.5" /> Long Term
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Due Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" type="button" className={cn("w-full justify-start gap-2", !dueDate && "text-muted-foreground")}>
                  <CalendarIcon className="w-4 h-4" />
                  {dueDate ? format(dueDate, 'PPP') : 'No due date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            {dueDate && (
              <button type="button" onClick={() => setDueDate(undefined)} className="text-xs text-muted-foreground hover:text-foreground mt-1">
                Clear date
              </button>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={!title.trim()}>
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
