import { useState } from 'react';
import { CalendarView } from '@/components/CalendarView';
import { TaskList } from '@/components/TaskList';
import { Timeline } from '@/components/Timeline';
import { AddTaskDialog } from '@/components/AddTaskDialog';
import { ColorSettings } from '@/components/ColorSettings';
import { GoalsList } from '@/components/GoalsList';
import { GoalReminders } from '@/components/GoalReminders';
import { FamilySharingDialog } from '@/components/FamilySharingDialog';
import { QuickStats } from '@/components/QuickStats';
import { CalendarSelector, CalendarFilter } from '@/components/CalendarSelector';
import { useTasks } from '@/hooks/useTasks';
import { useGoals } from '@/hooks/useGoals';
import { useCategoryColors } from '@/hooks/useCategoryColors';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { useFamilySharing } from '@/hooks/useFamilySharing';
import { LogOut, CalendarDays, Target } from 'lucide-react';
import brandLogo from '@/assets/brand-logo.png';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ViewTab = 'planner' | 'goals';

const Index = () => {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [activeView, setActiveView] = useState<ViewTab>('planner');
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calFilter, setCalFilter] = useState<CalendarFilter>({ type: 'personal' });

  const { tasks, addTask, toggleTask, editTask, deleteTask, getDatesWithTasks } = useTasks(calFilter);
  const { goals, addGoal, toggleGoal, deleteGoal, editGoal, getDatesWithGoals } = useGoals();
  const { colors, setCategoryColor, resetColors, completedDayColor, setCompletedDayColor } = useCategoryColors();
  const { groups } = useFamilySharing();

  const completedDates = new Set(
    Array.from(getDatesWithTasks().keys()).filter(date => {
      const dateTasks = tasks.filter(t => t.date === date);
      return dateTasks.length > 0 && dateTasks.every(t => t.completed);
    })
  );
  const { activeTheme, setTheme, themes } = useTheme();
  const { signOut } = useAuth();

  const calendarLabel = calFilter.type === 'group' ? calFilter.groupName : null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center">
            <img src={brandLogo} alt="Athlete Planner logo" className="w-9 h-9 object-cover" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-display font-bold tracking-tight">
              Athlete<span className="text-gradient">Planner</span>
            </h1>
            <p className="text-xs text-muted-foreground">
              {calendarLabel ? `Viewing ${calendarLabel}` : 'Train. Study. Dominate.'}
            </p>
          </div>

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

          <FamilySharingDialog />
          <ColorSettings colors={colors} onChangeColor={setCategoryColor} onReset={resetColors} activeTheme={activeTheme} themes={themes} onChangeTheme={setTheme} completedDayColor={completedDayColor} onChangeCompletedDayColor={setCompletedDayColor} />
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
                datesWithGoals={getDatesWithGoals()}
                completedDates={completedDates}
                onMonthChange={(y, m) => { setCalYear(y); setCalMonth(m); }}
              />
              <CalendarSelector
                groups={groups}
                activeFilter={calFilter}
                onSelectFilter={setCalFilter}
              />
              <GoalReminders goals={goals} viewYear={calYear} viewMonth={calMonth} />
              <QuickStats tasks={tasks} />
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
            <GoalsList goals={goals} addGoal={addGoal} toggleGoal={toggleGoal} deleteGoal={deleteGoal} editGoal={editGoal} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
