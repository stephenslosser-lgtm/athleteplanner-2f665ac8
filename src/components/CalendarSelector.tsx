import { useAuth } from '@/hooks/useAuth';
import { FamilyMemberProfile } from '@/hooks/useFamilyMembers';
import { cn } from '@/lib/utils';
import { User, Users } from 'lucide-react';

interface CalendarSelectorProps {
  familyMembers: FamilyMemberProfile[];
  selectedUserId: string | null; // null = own calendar
  onSelectUser: (userId: string | null) => void;
}

export function CalendarSelector({ familyMembers, selectedUserId, onSelectUser }: CalendarSelectorProps) {
  const { user } = useAuth();

  if (familyMembers.length === 0) return null;

  return (
    <div className="bg-card rounded-xl p-4 border border-border space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
        <Users className="w-3.5 h-3.5" />
        Calendars
      </div>
      <button
        onClick={() => onSelectUser(null)}
        className={cn(
          "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
          selectedUserId === null
            ? "bg-primary/15 text-primary ring-1 ring-primary/30 font-medium"
            : "hover:bg-secondary/60 text-foreground/80"
        )}
      >
        <User className="w-3.5 h-3.5" />
        My Calendar
      </button>
      {familyMembers.map(member => (
        <button
          key={member.user_id}
          onClick={() => onSelectUser(member.user_id)}
          className={cn(
            "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
            selectedUserId === member.user_id
              ? "bg-primary/15 text-primary ring-1 ring-primary/30 font-medium"
              : "hover:bg-secondary/60 text-foreground/80"
          )}
        >
          <User className="w-3.5 h-3.5" />
          {member.display_name}
        </button>
      ))}
    </div>
  );
}
