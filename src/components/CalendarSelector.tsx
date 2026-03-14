import { useAuth } from '@/hooks/useAuth';
import { FamilyGroup } from '@/hooks/useFamilySharing';
import { cn } from '@/lib/utils';
import { User, Users } from 'lucide-react';

export type CalendarFilter = 
  | { type: 'personal' }
  | { type: 'group'; groupId: string; groupName: string };

interface CalendarSelectorProps {
  groups: FamilyGroup[];
  activeFilter: CalendarFilter;
  onSelectFilter: (filter: CalendarFilter) => void;
}

export function CalendarSelector({ groups, activeFilter, onSelectFilter }: CalendarSelectorProps) {
  if (groups.length === 0) return null;

  return (
    <div className="bg-card rounded-xl p-4 border border-border space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
        <Users className="w-3.5 h-3.5" />
        Calendars
      </div>
      <button
        onClick={() => onSelectFilter({ type: 'personal' })}
        className={cn(
          "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
          activeFilter.type === 'personal'
            ? "bg-primary/15 text-primary ring-1 ring-primary/30 font-medium"
            : "hover:bg-secondary/60 text-foreground/80"
        )}
      >
        <User className="w-3.5 h-3.5" />
        My Calendar
      </button>
      {groups.map(group => (
        <button
          key={group.id}
          onClick={() => onSelectFilter({ type: 'group', groupId: group.id, groupName: group.name })}
          className={cn(
            "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
            activeFilter.type === 'group' && activeFilter.groupId === group.id
              ? "bg-primary/15 text-primary ring-1 ring-primary/30 font-medium"
              : "hover:bg-secondary/60 text-foreground/80"
          )}
        >
          <Users className="w-3.5 h-3.5" />
          {group.name}
        </button>
      ))}
    </div>
  );
}
