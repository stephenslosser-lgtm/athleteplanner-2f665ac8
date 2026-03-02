import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Copy, Check, Plus, LogOut, UserPlus } from 'lucide-react';
import { useFamilySharing } from '@/hooks/useFamilySharing';
import { useToast } from '@/hooks/use-toast';

export function FamilySharingDialog() {
  const { groups, members, loading, createGroup, joinGroup, leaveGroup } = useFamilySharing();
  const [open, setOpen] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [groupName, setGroupName] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [tab, setTab] = useState<'groups' | 'join'>('groups');
  const { toast } = useToast();

  const handleCreate = async () => {
    if (!groupName.trim()) return;
    const group = await createGroup(groupName.trim());
    if (group) {
      toast({ title: 'Family group created!', description: `Share code: ${group.invite_code}` });
      setGroupName('');
    }
  };

  const handleJoin = async () => {
    if (!joinCode.trim()) return;
    const result = await joinGroup(joinCode.trim());
    if (result.success) {
      toast({ title: 'Joined family group!' });
      setJoinCode('');
      setTab('groups');
    } else {
      toast({ title: 'Failed to join', description: result.error, variant: 'destructive' });
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" title="Family Sharing">
          <Users className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Family Sharing
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-1 bg-secondary/50 rounded-lg p-1 mb-4">
          <button
            onClick={() => setTab('groups')}
            className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              tab === 'groups' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            My Groups
          </button>
          <button
            onClick={() => setTab('join')}
            className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              tab === 'join' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="flex items-center justify-center gap-1"><UserPlus className="w-3 h-3" /> Join</span>
          </button>
        </div>

        {tab === 'groups' ? (
          <div className="space-y-4">
            {groups.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No family groups yet. Create one or join with a code!
              </p>
            ) : (
              <div className="space-y-3">
                {groups.map(g => {
                  const memberCount = members.filter(m => m.group_id === g.id).length;
                  return (
                    <div key={g.id} className="bg-secondary/40 rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{g.name}</span>
                        <span className="text-xs text-muted-foreground">{memberCount} member{memberCount !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 text-xs bg-background/50 rounded px-2 py-1 font-mono">
                          {g.invite_code}
                        </code>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleCopy(g.invite_code)}>
                          {copied === g.invite_code ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => leaveGroup(g.id)} title="Leave group">
                          <LogOut className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex gap-2">
              <Input
                placeholder="Group name"
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
                className="text-sm"
                onKeyDown={e => e.key === 'Enter' && handleCreate()}
              />
              <Button onClick={handleCreate} disabled={loading || !groupName.trim()} size="sm">
                <Plus className="w-3.5 h-3.5 mr-1" /> Create
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Enter the invite code shared by a family member to join their group and see each other's events.
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="Enter invite code"
                value={joinCode}
                onChange={e => setJoinCode(e.target.value)}
                className="text-sm font-mono"
                onKeyDown={e => e.key === 'Enter' && handleJoin()}
              />
              <Button onClick={handleJoin} disabled={loading || !joinCode.trim()} size="sm">
                Join
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
