import { Task, CATEGORY_CONFIG } from '@/types/task';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskListProps {
  tasks: Task[];
  selectedDate: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

export function TaskList({ tasks, selectedDate, onToggle, onDelete }: TaskListProps) {
  const dateTasks = tasks.filter(t => t.date === selectedDate);
  const incomplete = dateTasks.filter(t => !t.completed);
  const completed = dateTasks.filter(t => t.completed);

  return (
    <div className="bg-card rounded-xl p-5 border border-border flex-1">
      <h2 className="text-lg font-display font-semibold mb-1">{formatDate(selectedDate)}</h2>
      <p className="text-sm text-muted-foreground mb-4">
        {dateTasks.length} task{dateTasks.length !== 1 ? 's' : ''} · {completed.length} done
      </p>

      {dateTasks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <p className="text-sm">No tasks for this day</p>
          <p className="text-xs mt-1">Add one below!</p>
        </div>
      )}

      <div className="space-y-2">
        {incomplete.map(task => (
          <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
        ))}
      </div>

      {completed.length > 0 && (
        <>
          <div className="border-t border-border my-3" />
          <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Completed</p>
          <div className="space-y-2">
            {completed.map(task => (
              <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function TaskItem({ task, onToggle, onDelete }: { task: Task; onToggle: (id: string) => void; onDelete: (id: string) => void }) {
  const config = CATEGORY_CONFIG[task.category];

  return (
    <div className={cn(
      "group flex items-center gap-3 p-3 rounded-lg transition-all",
      "bg-secondary/40 hover:bg-secondary/70",
      task.completed && "opacity-50"
    )}>
      <Checkbox
        checked={task.completed}
        onCheckedChange={() => onToggle(task.id)}
        className="border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
      />
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-medium truncate", task.completed && "line-through text-muted-foreground")}>
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={cn("w-2 h-2 rounded-full", config.dotClass)} />
          <span className="text-xs text-muted-foreground">{config.label}</span>
          {task.time && (
            <>
              <Clock className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{task.time}</span>
            </>
          )}
        </div>
      </div>
      <button
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-destructive"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
