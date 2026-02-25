import { useState } from 'react';
import { CalendarView } from '@/components/CalendarView';
import { TaskList } from '@/components/TaskList';
import { Timeline } from '@/components/Timeline';
import { AddTaskDialog } from '@/components/AddTaskDialog';
import { ColorSettings } from '@/components/ColorSettings';
import { GoalsList } from '@/components/GoalsList';
import { useTasks } from '@/hooks/useTasks';
import { useCategoryColors } from '@/hooks/useCategoryColors';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { Dumbbell, LogOut, CalendarDays, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ViewTab = 'planner' | 'goals';

const Index = () => {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [activeView, setActiveView] = useState<ViewTab>('planner');
  const { tasks, addTask, toggleTask, editTask, deleteTask, getDatesWithTasks } = useTasks();
  const { colors, setCategoryColor, resetColors } = useCategoryColors();
  const { activeTheme, setTheme, themes } = useTheme();
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-display font-bold tracking-tight">
              Athlete<span className="text-gradient">Planner</span>
            </h1>
            <p className="text-xs text-muted-foreground">Train. Study. Dominate.</p>
          </div>

          {/* View tabs */}
          <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-1">
            <button
              onClick={() => setActiveView('planner')}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                activeView === 'planner' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              Planner
            </button>
            <button
              onClick={() => setActiveView('goals')}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                activeView === 'goals' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Target className="w-3.5 h-3.5" />
              Goals
            </button>
          </div>

          <ColorSettings colors={colors} onChangeColor={setCategoryColor} onReset={resetColors} activeTheme={activeTheme} themes={themes} onChangeTheme={setTheme} />
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={signOut} title="Sign out">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {activeView === 'planner' ? (
          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr_300px] gap-6">
            <div className="space-y-4">
              <CalendarView
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                datesWithTasks={getDatesWithTasks()}
              />
              <AddTaskDialog selectedDate={selectedDate} onAdd={addTask} />
            </div>
            <TaskList
              tasks={tasks}
              selectedDate={selectedDate}
              onToggle={toggleTask}
              onEdit={editTask}
              onDelete={deleteTask}
            />
            <div className="hidden lg:block">
              <Timeline tasks={tasks} selectedDate={selectedDate} />
            </div>
          </div>
        ) : (
          <div className="max-w-xl mx-auto">
            <GoalsList />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
