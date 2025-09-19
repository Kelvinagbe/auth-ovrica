import { Shield, Lock, Key } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="text-center space-y-6 max-w-md">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-900/30">
            <Shield className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            Authentication Service
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Secure authentication infrastructure for Ovrica services
          </p>
        </div>

        {/* Status indicator (optional) */}
        <div className="flex items-center justify-center space-x-2 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-slate-600 dark:text-slate-400">Service operational</span>
        </div>

        {/* Optional info */}
        <div className="text-xs text-slate-500 dark:text-slate-500 pt-4 border-t border-slate-200 dark:border-slate-700">
          This is an authentication service endpoint.<br/>
          Direct access is not intended for end users.
        </div>
      </div>
    </main>
  );
}