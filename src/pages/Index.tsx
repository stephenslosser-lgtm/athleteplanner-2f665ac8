import { useState } from 'react';
import { CalendarView } from '@/components/CalendarView';
import { TaskList } from '@/components/TaskList';
import { AddTaskDialog } from '@/components/AddTaskDialog';
import { ColorSettings } from '@/components/ColorSettings';
import { useTasks } from '@/hooks/useTasks';
import { useCategoryColors } from '@/hooks/useCategoryColors';
import { Dumbbell } from 'lucide-react';

const Index = () => {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const { tasks, addTask, toggleTask, deleteTask, getDatesWithTasks } = useTasks();
  const { colors, setCategoryColor, resetColors } = useCategoryColors();

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
          <ColorSettings colors={colors} onChangeColor={setCategoryColor} onReset={resetColors} />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
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
            onDelete={deleteTask}
          />
        </div>
      </main>
    </div>
  );
};

export default Index;
