import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaskCategory } from '@/types/task';
import { cn } from '@/lib/utils';

interface CalendarViewProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  datesWithTasks: Map<string, Set<TaskCategory>>;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function toDateStr(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

export function CalendarView({ selectedDate, onSelectDate, datesWithTasks }: CalendarViewProps) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());

  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prev = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const next = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="bg-card rounded-xl p-5 border border-border">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-display font-semibold">
          {MONTHS[viewMonth]} {viewYear}
        </h2>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={prev} className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={next} className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map(d => (
          <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />;
          const dateStr = toDateStr(viewYear, viewMonth, day);
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDate;
          const categories = datesWithTasks.get(dateStr);

          return (
            <button
              key={dateStr}
              onClick={() => onSelectDate(dateStr)}
              className={cn(
                "relative flex flex-col items-center justify-center py-2 rounded-lg transition-all text-sm",
                isSelected && "bg-primary/20 text-primary ring-1 ring-primary/40",
                isToday && !isSelected && "bg-secondary text-foreground font-semibold",
                !isSelected && !isToday && "hover:bg-secondary/60 text-foreground/80"
              )}
            >
              {day}
              {categories && categories.size > 0 && (
                <div className="flex gap-0.5 mt-0.5">
                  {Array.from(categories).map(cat => (
                    <span
                      key={cat}
                      className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        cat === 'training' && "bg-training",
                        cat === 'academic' && "bg-academic",
                        cat === 'personal' && "bg-personal"
                      )}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
