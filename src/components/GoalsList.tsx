import { useState } from 'react';
import { Goal, GoalType, useGoals } from '@/hooks/useGoals';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Target, Rocket } from 'lucide-react';

export function GoalsList() {
  const { goals, addGoal, toggleGoal, deleteGoal } = useGoals();
  const [newTitle, setNewTitle] = useState('');
  const [activeTab, setActiveTab] = useState<GoalType>('short_term');

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    addGoal(newTitle.trim(), activeTab);
    setNewTitle('');
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
          <GoalItem key={goal.id} goal={goal} onToggle={toggleGoal} onDelete={deleteGoal} />
        ))}

        {completed.length > 0 && (
          <>
            <div className="border-t border-border my-3" />
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Completed</p>
            {completed.map(goal => (
              <GoalItem key={goal.id} goal={goal} onToggle={toggleGoal} onDelete={deleteGoal} />
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
        <Button size="sm" onClick={handleAdd} disabled={!newTitle.trim()}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

function GoalItem({ goal, onToggle, onDelete }: { goal: Goal; onToggle: (id: string) => void; onDelete: (id: string) => void }) {
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
      <span className={cn("flex-1 text-sm", goal.completed && "line-through text-muted-foreground")}>
        {goal.title}
      </span>
      <button
        onClick={() => onDelete(goal.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-destructive"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
