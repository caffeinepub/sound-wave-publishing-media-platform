import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, LogIn } from 'lucide-react';

interface AccessDeniedScreenProps {
  variant: 'login-required' | 'unauthorized';
}

export default function AccessDeniedScreen({ variant }: AccessDeniedScreenProps) {
  const navigate = useNavigate();

  const isLoginRequired = variant === 'login-required';

  return (
    <div className="container flex min-h-[600px] items-center justify-center py-16">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            {isLoginRequired ? (
              <LogIn className="h-10 w-10 text-red-600 dark:text-red-400" />
            ) : (
              <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {isLoginRequired ? 'Login Required' : 'Unauthorized'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">
            {isLoginRequired
              ? 'You must be logged in to access this page. Please log in to continue.'
              : 'You do not have permission to view this page. This page is only accessible to administrators or users with the appropriate access role.'}
          </p>
          <Button onClick={() => navigate({ to: '/' })} className="w-full">
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
