import { Settings2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaskCategory, COLOR_PRESETS, CATEGORY_LABELS } from '@/types/task';
import { ThemePreset } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { useRef } from 'react';
import { toast } from 'sonner';
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
  background: string | null;
  onChangeBackground: (img: string | null) => void;
  backgroundOpacity: number;
  onChangeBackgroundOpacity: (v: number) => void;
  cardOpacity: number;
  onChangeCardOpacity: (v: number) => void;
}

const categories: TaskCategory[] = ['training', 'academic', 'personal'];

export function ColorSettings({ colors, onChangeColor, onReset, activeTheme, themes, onChangeTheme, completedDayColor, onChangeCompletedDayColor, background, onChangeBackground, backgroundOpacity, onChangeBackgroundOpacity, cardOpacity, onChangeCardOpacity }: ColorSettingsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      const result = e.target?.result as string;
      onChangeBackground(result);
      toast.success('Background updated');
    };
    reader.readAsDataURL(file);
  };

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

          {/* Background Image Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display text-sm font-semibold">Background</h3>
              {background && (
                <button
                  onClick={() => onChangeBackground(null)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  <X className="h-3 w-3" /> Clear
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
                e.target.value = '';
              }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "w-full h-20 rounded-lg border border-dashed border-border bg-secondary/40 hover:bg-secondary/70 transition-colors flex items-center justify-center text-xs text-muted-foreground gap-2 overflow-hidden relative"
              )}
              style={background ? { backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
            >
              {background ? (
                <span className="bg-background/70 px-2 py-1 rounded text-foreground">Change image</span>
              ) : (
                <>
                  <Upload className="h-3.5 w-3.5" /> Upload image
                </>
              )}
            </button>
            {background && (
              <div className="mt-3">
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Overlay {Math.round(backgroundOpacity * 100)}%</label>
                <Slider
                  value={[backgroundOpacity * 100]}
                  min={0}
                  max={95}
                  step={5}
                  onValueChange={v => onChangeBackgroundOpacity(v[0] / 100)}
                  className="mt-1.5"
                />
              </div>
            )}
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

          <Separator className="bg-border" />

          {/* Completed Day Color */}
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">
              All Tasks Completed
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COLOR_PRESETS.map(preset => {
                const isSelected = completedDayColor === preset.hsl;
                return (
                  <button
                    key={preset.hsl}
                    title={preset.name}
                    onClick={() => onChangeCompletedDayColor(preset.hsl)}
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
        </div>
      </PopoverContent>
    </Popover>
  );
}
