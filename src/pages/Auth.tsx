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
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
            <Dumbbell className="w-7 h-7 text-primary" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-display font-bold tracking-tight">
              Athlete<span className="text-gradient">Planner</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Train. Study. Dominate.</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="font-display text-lg font-semibold mb-4">
            {isLogin ? 'Welcome back' : 'Create account'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="bg-secondary border-border"
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="bg-secondary border-border"
              required
              minLength={6}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>
          {isLogin && (
            <button
              onClick={handleForgotPassword}
              className="text-xs text-muted-foreground hover:text-foreground mt-3 block transition-colors"
            >
              Forgot password?
            </button>
          )}
        </div>

        <p className="text-center text-sm text-muted-foreground">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button onClick={() => setIsLogin(!isLogin)} className="text-primary hover:underline">
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}
