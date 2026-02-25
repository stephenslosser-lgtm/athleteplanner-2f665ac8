import { Task } from '@/types/task';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface TimelineProps {
  tasks: Task[];
  selectedDate: string;
}

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6); // 6 AM to 9 PM
const HOUR_HEIGHT = 48; // px per hour
const START_HOUR = 6;

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

  const totalHeight = HOURS.length * HOUR_HEIGHT;

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-display font-semibold uppercase tracking-wider text-muted-foreground">
          Timeline
        </h3>
      </div>

      <div className="relative" style={{ height: totalHeight }}>
        {/* Hour grid lines */}
        {HOURS.map((hour, i) => (
          <div
            key={hour}
            className="absolute left-0 right-0 flex items-start gap-3"
            style={{ top: i * HOUR_HEIGHT }}
          >
            <div className="w-12 text-[11px] text-muted-foreground text-right shrink-0 font-medium leading-none pt-px">
              {formatHour(hour)}
            </div>
            <div className="flex flex-col items-center shrink-0">
              <div className="w-2 h-2 rounded-full bg-border" />
              <div className="w-px bg-border" style={{ height: HOUR_HEIGHT - 8 }} />
            </div>
            <div className="flex-1" />
          </div>
        ))}

        {/* Task bars */}
        {scheduled.map(task => {
          const startMins = timeToMinutes(task.time!);
          const endMins = task.end_time ? timeToMinutes(task.end_time) : startMins + 30;
          const duration = Math.max(endMins - startMins, 15);

          const topPx = ((startMins - START_HOUR * 60) / 60) * HOUR_HEIGHT;
          const heightPx = (duration / 60) * HOUR_HEIGHT;

          const leftOffset = 80;

          // Use CSS variable for category color
          const categoryVar = `var(--${task.category})`;

          return (
            <div
              key={task.id}
              className={cn(
                "absolute right-0 rounded-md text-xs overflow-hidden",
                task.completed && "opacity-40"
              )}
              style={{
                top: topPx,
                height: Math.max(heightPx, 20),
                left: leftOffset,
                backgroundColor: `hsl(${categoryVar} / 0.12)`,
                borderLeft: `3px solid hsl(${categoryVar})`,
                border: `1px solid hsl(${categoryVar} / 0.25)`,
                borderLeftWidth: 3,
                borderLeftColor: `hsl(${categoryVar})`,
              }}
            >
              <div className="h-full px-2.5 py-1 flex flex-col justify-center">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: `hsl(${categoryVar})` }}
                  />
                  <span className={cn("truncate font-medium", task.completed && "line-through")}>
                    {task.title}
                  </span>
                </div>
                {heightPx > 28 && (
                  <span className="text-[10px] text-muted-foreground mt-0.5 pl-3">
                    {task.time}{task.end_time ? ` – ${task.end_time}` : ''}
                  </span>
                )}
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
              const categoryVar = `var(--${task.category})`;
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
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: `hsl(${categoryVar})` }}
                    />
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
