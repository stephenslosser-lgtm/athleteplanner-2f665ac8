import { format } from 'date-fns';
import { Goal } from '@/hooks/useGoals';
import { Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GoalRemindersProps {
  goals: Goal[];
  viewYear: number;
  viewMonth: number; // 0-indexed
}

export function GoalReminders({ goals, viewYear, viewMonth }: GoalRemindersProps) {
  const goalsThisMonth = goals.filter(g => {
    if (!g.due_date || g.completed) return false;
    const d = new Date(g.due_date + 'T00:00:00');
    return d.getFullYear() === viewYear && d.getMonth() === viewMonth;
  }).sort((a, b) => a.due_date!.localeCompare(b.due_date!));

  if (goalsThisMonth.length === 0) return null;

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-card rounded-xl border border-border p-4 space-y-2">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
        <Target className="w-3 h-3" />
        Goal Deadlines This Month
      </p>
      {goalsThisMonth.map(goal => {
        const isOverdue = goal.due_date! < todayStr;
        return (
          <div key={goal.id} className="flex items-center gap-2 text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
            <span className="flex-1 truncate">{goal.title}</span>
            <span className={cn("text-xs shrink-0", isOverdue ? "text-destructive font-medium" : "text-muted-foreground")}>
              {format(new Date(goal.due_date + 'T00:00:00'), 'MMM d')}
            </span>
          </div>
        );
      })}
    </div>
  );
}
