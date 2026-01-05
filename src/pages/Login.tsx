import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Lock, User } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      setIsLoading(false);
      return;
    }

    const result = await login(username, password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Lock className="w-8 h-8 text-cyan-400" />
            <h1 className="text-3xl font-bold text-cyan-400" style={{ fontFamily: 'Orbitron' }}>
              SmartSense
            </h1>
          </div>
          <p className="text-slate-400">Industrial Safety Monitor</p>
        </div>

        {/* Login Card */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="space-y-2">
            <CardTitle className="text-cyan-400">Sign In</CardTitle>
            <CardDescription>
              Access your SmartSense monitoring dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <User className="w-4 h-4 text-cyan-400" />
                  Username
                </label>
                <Input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-cyan-400"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-cyan-400"
                />
              </div>

              {/* Error Alert */}
              {error && (
                <Alert className="bg-red-900/20 border-red-600 text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Signup Link */}
            <div className="mt-6 pt-6 border-t border-slate-600 text-center">
              <p className="text-sm text-slate-400 mb-3">
                Don't have an account?
              </p>
              <Button
                variant="outline"
                onClick={() => navigate('/signup')}
                className="w-full border-cyan-600 text-cyan-400 hover:bg-cyan-600/10"
              >
                Create New Account
              </Button>
            </div>

            {/* Demo Credentials Info */}
            <div className="mt-6 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
              <p className="text-xs font-semibold text-cyan-400 mb-2">Demo Credentials:</p>
              <div className="space-y-1 text-xs text-slate-400">
                <p><span className="text-cyan-300">Admin:</span> admin / admin123</p>
                <p><span className="text-cyan-300">User:</span> user / user123</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-slate-500 text-sm mt-6">
          Industrial Safety Monitoring System • v1.0.0
        </p>
      </div>
    </div>
  );
};

export default Login;
