import { Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaskCategory, COLOR_PRESETS, CATEGORY_LABELS } from '@/types/task';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface ColorSettingsProps {
  colors: Record<TaskCategory, string>;
  onChangeColor: (category: TaskCategory, hsl: string) => void;
  onReset: () => void;
}

const categories: TaskCategory[] = ['training', 'academic', 'personal'];

export function ColorSettings({ colors, onChangeColor, onReset }: ColorSettingsProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Settings2 className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 bg-card border-border" align="end">
        <div className="space-y-4">
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
