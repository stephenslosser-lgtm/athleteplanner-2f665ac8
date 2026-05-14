import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dumbbell } from 'lucide-react';
import { toast } from 'sonner';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message);
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Check your email to confirm your account!');
      }
    }

    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error('Enter your email first');
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) toast.error(error.message);
    else toast.success('Password reset email sent!');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 relative overflow-hidden">
      <div className="ambient-glow" />
      <div className="relative w-full max-w-[420px] flex flex-col items-center">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-card to-background border border-border rounded-2xl shadow-2xl mb-6">
            <Dumbbell className="w-7 h-7 text-primary" />
          </div>
          <h1 className="font-display text-5xl text-foreground tracking-tight leading-none">
            Athlete<span className="italic text-primary">Planner</span>
          </h1>
          <p className="mt-3 label-eyebrow">Train · Study · Dominate</p>
        </div>

        <div className="w-full bg-card border border-border/60 rounded-3xl p-8 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.6)] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/[0.02] to-transparent pointer-events-none" />
          <div className="relative">
            <h2 className="font-display text-2xl text-foreground mb-8">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="label-eyebrow ml-1 block">Email</label>
                <Input
                  type="email"
                  placeholder="name@team.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="bg-background/40 border-border h-12 rounded-xl px-4"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-end justify-between">
                  <label className="label-eyebrow ml-1 block">Password</label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-[10px] uppercase tracking-[0.2em] text-primary/80 hover:text-primary transition-colors"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="bg-background/40 border-border h-12 rounded-xl px-4"
                  required
                  minLength={6}
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-semibold tracking-wide"
              >
                {loading ? 'Loading…' : isLogin ? 'Sign In' : 'Sign Up'}
              </Button>
            </form>
          </div>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          {isLogin ? 'New to the roster?' : 'Already have an account?'}{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-foreground hover:text-primary font-medium ml-1 underline underline-offset-4 decoration-border hover:decoration-primary transition-colors"
          >
            {isLogin ? 'Join now' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}
