import { Task, CATEGORY_CONFIG } from '@/types/task';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface TimelineProps {
  tasks: Task[];
  selectedDate: string;
}

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6); // 6 AM to 9 PM

function formatHour(h: number) {
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hour} ${ampm}`;
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export function Timeline({ tasks, selectedDate }: TimelineProps) {
  const dateTasks = tasks.filter(t => t.date === selectedDate);
  const scheduled = dateTasks.filter(t => t.time).sort((a, b) => a.time!.localeCompare(b.time!));
  const unscheduled = dateTasks.filter(t => !t.time);

  return (
    <div className="bg-card rounded-xl p-5 border border-border">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-display font-semibold uppercase tracking-wider text-muted-foreground">
          Timeline
        </h3>
      </div>

      <div className="relative">
        {HOURS.map(hour => {
          const hourStr = `${String(hour).padStart(2, '0')}:00`;
          const hourTasks = scheduled.filter(t => {
            const mins = timeToMinutes(t.time!);
            return mins >= hour * 60 && mins < (hour + 1) * 60;
          });

          return (
            <div key={hour} className="flex gap-3 min-h-[2.5rem]">
              {/* Time label */}
              <div className="w-12 text-[11px] text-muted-foreground pt-0.5 text-right shrink-0 font-medium">
                {formatHour(hour)}
              </div>

              {/* Line + dot */}
              <div className="flex flex-col items-center shrink-0">
                <div className={cn(
                  "w-2 h-2 rounded-full mt-1.5",
                  hourTasks.length > 0 ? "bg-primary" : "bg-border"
                )} />
                <div className="w-px flex-1 bg-border" />
              </div>

              {/* Tasks at this hour */}
              <div className="flex-1 pb-2 space-y-1">
                {hourTasks.map(task => {
                  const config = CATEGORY_CONFIG[task.category];
                  return (
                    <div
                      key={task.id}
                      className={cn(
                        "text-xs px-2.5 py-1.5 rounded-md border",
                        "bg-secondary/50 border-border",
                        task.completed && "opacity-40 line-through"
                      )}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", config.dotClass)} />
                        <span className="truncate font-medium">{task.title}</span>
                        <span className="text-muted-foreground ml-auto shrink-0">
                          {task.time}{task.end_time ? ` – ${task.end_time}` : ''}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Unscheduled tasks */}
      {unscheduled.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-2">No time set</p>
          <div className="space-y-1">
            {unscheduled.map(task => {
              const config = CATEGORY_CONFIG[task.category];
              return (
                <div
                  key={task.id}
                  className={cn(
                    "text-xs px-2.5 py-1.5 rounded-md",
                    "bg-secondary/30",
                    task.completed && "opacity-40 line-through"
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", config.dotClass)} />
                    <span className="truncate">{task.title}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
