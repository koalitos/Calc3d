import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

function Login({ onLoginSuccess, onSwitchToRegister }) {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:35001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('token', data.data.token);
        onLoginSuccess(data.data.user);
      } else {
        setError(data.error?.message || t('auth.errors.loginFailed'));
      }
    } catch (err) {
      setError(t('auth.errors.connectionError'));
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-4xl font-bold">💎 {t('app.title')}</CardTitle>
          <CardDescription>{t('auth.systemSubtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-semibold text-center mb-6">{t('auth.loginTitle')}</h2>

            {error && (
              <div className="bg-destructive/10 border border-destructive/50 text-destructive-foreground px-4 py-3 rounded-md text-sm">
                ⚠️ {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">{t('auth.username')}</Label>
              <Input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t('auth.usernamePlaceholder')}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth.passwordPlaceholder')}
                required
                disabled={loading}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? t('auth.loggingIn') : t('auth.login')}
            </Button>

            <div className="text-center text-sm text-muted-foreground mt-4">
              {t('auth.noAccount')}{' '}
              <Button 
                type="button"
                variant="link"
                onClick={onSwitchToRegister}
                disabled={loading}
                className="p-0 h-auto"
              >
                {t('auth.createAccount')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
