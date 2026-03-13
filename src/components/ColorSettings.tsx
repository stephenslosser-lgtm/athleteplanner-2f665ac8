import { Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaskCategory, COLOR_PRESETS, CATEGORY_LABELS } from '@/types/task';
import { ThemePreset } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface ColorSettingsProps {
  colors: Record<TaskCategory, string>;
  onChangeColor: (category: TaskCategory, hsl: string) => void;
  onReset: () => void;
  activeTheme: string;
  themes: ThemePreset[];
  onChangeTheme: (name: string) => void;
  completedDayColor: string;
  onChangeCompletedDayColor: (hsl: string) => void;
}

const categories: TaskCategory[] = ['training', 'academic', 'personal'];

export function ColorSettings({ colors, onChangeColor, onReset, activeTheme, themes, onChangeTheme }: ColorSettingsProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Settings2 className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 bg-card border-border" align="end">
        <div className="space-y-4">
          {/* Theme Section */}
          <div>
            <h3 className="font-display text-sm font-semibold mb-2">Theme</h3>
            <p className="text-[10px] text-muted-foreground mb-1.5 uppercase tracking-wider">Dark</p>
            <div className="grid grid-cols-3 gap-1.5 mb-2">
              {themes.filter(t => t.mode === 'dark').map(theme => (
                <button
                  key={theme.name}
                  onClick={() => onChangeTheme(theme.name)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 p-2 rounded-lg text-[10px] transition-all border",
                    activeTheme === theme.name
                      ? "border-foreground/40 bg-secondary"
                      : "border-transparent hover:bg-secondary/50"
                  )}
                >
                  <div className="flex gap-1">
                    <span className="w-4 h-4 rounded-full" style={{ backgroundColor: `hsl(${theme.primary})` }} />
                    <span className="w-4 h-4 rounded-full" style={{ backgroundColor: `hsl(${theme.background})` }} />
                  </div>
                  <span className="text-muted-foreground truncate w-full text-center">
                    {theme.name.replace(' (Default)', '')}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground mb-1.5 uppercase tracking-wider">Light</p>
            <div className="grid grid-cols-3 gap-1.5">
              {themes.filter(t => t.mode === 'light').map(theme => (
                <button
                  key={theme.name}
                  onClick={() => onChangeTheme(theme.name)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 p-2 rounded-lg text-[10px] transition-all border",
                    activeTheme === theme.name
                      ? "border-foreground/40 bg-secondary"
                      : "border-transparent hover:bg-secondary/50"
                  )}
                >
                  <div className="flex gap-1">
                    <span className="w-4 h-4 rounded-full" style={{ backgroundColor: `hsl(${theme.primary})` }} />
                    <span className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: `hsl(${theme.background})` }} />
                  </div>
                  <span className="text-muted-foreground truncate w-full text-center">
                    {theme.name.replace('Light ', '')}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Category Colors Section */}
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-semibold">Category Colors</h3>
            <button
              onClick={onReset}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Reset
            </button>
          </div>
          {categories.map(cat => (
            <div key={cat}>
              <label className="text-xs text-muted-foreground mb-1.5 block">
                {CATEGORY_LABELS[cat]}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {COLOR_PRESETS.map(preset => {
                  const isSelected = colors[cat] === preset.hsl;
                  return (
                    <button
                      key={preset.hsl}
                      title={preset.name}
                      onClick={() => onChangeColor(cat, preset.hsl)}
                      className={cn(
                        "w-6 h-6 rounded-full transition-all border-2",
                        isSelected
                          ? "border-foreground scale-110"
                          : "border-transparent hover:scale-110"
                      )}
                      style={{ backgroundColor: `hsl(${preset.hsl})` }}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
