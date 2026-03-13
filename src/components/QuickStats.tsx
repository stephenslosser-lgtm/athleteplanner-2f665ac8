import { Task, TaskCategory, CATEGORY_LABELS } from '@/types/task';
import { cn } from '@/lib/utils';

interface QuickStatsProps {
  tasks: Task[];
}

export function QuickStats({ tasks }: QuickStatsProps) {
  const categories: TaskCategory[] = ['training', 'academic', 'personal'];
  const activeTasks = tasks.filter(t => !t.completed);
  const counts = categories.map(cat => ({
    category: cat,
    label: CATEGORY_LABELS[cat],
    total: activeTasks.filter(t => t.category === cat).length,
  }));

  return (
    <div className="bg-card rounded-xl p-4 border border-border">
      <h3 className="text-sm font-semibold mb-3 text-foreground">Quick Stats</h3>
      <div className="grid grid-cols-3 gap-2">
        {counts.map(c => (
          <div key={c.category} className="flex flex-col items-center p-2 rounded-lg bg-secondary/40">
            <span className={cn("w-2.5 h-2.5 rounded-full mb-1.5", `bg-${c.category}`)} />
            <span className="text-lg font-bold text-foreground">{c.total}</span>
            <span className="text-[10px] text-muted-foreground">{c.label}</span>
            <span className="text-[10px] text-muted-foreground">remaining</span>
          </div>
        ))}
      </div>
    </div>
  );
}
