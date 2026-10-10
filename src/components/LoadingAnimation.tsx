import { Loader2 } from 'lucide-react';

interface LoadingAnimationProps {
  message?: string;
}

export default function LoadingAnimation({ message = 'Loading...' }: LoadingAnimationProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      <p className="text-sm text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  );
}
