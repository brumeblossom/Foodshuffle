import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';
import { useUiStore } from '../app/uiStore';
import { CheckmarkCircle02Icon, Cancel01Icon, Alert01Icon, InformationCircleIcon } from 'hugeicons-react';

export const AppShell: React.FC = () => {
  const { toasts, removeToast } = useUiStore();

  return (
    <div className="min-h-screen bg-bg text-text transition-colors duration-200 flex flex-col md:flex-row">
      {/* Responsive Navigation Component */}
      <Navigation />

      {/* Main Content Area */}
      <main className="flex-1 md:pl-64 pb-20 md:pb-8 min-h-screen">
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>

      {/* Global Toast Notification Container */}
      <div 
        className="fixed bottom-20 md:bottom-6 right-6 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none"
        aria-live="assertive"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto flex items-center justify-between p-4 rounded bg-surface border border-primary/10 shadow-lg text-text font-sans text-sm gap-3 animate-slide-in motion-reduce:animate-none border-l-4 border-l-primary"
            style={{
              borderLeftColor:
                toast.type === 'success'
                  ? 'var(--success)'
                  : toast.type === 'danger'
                  ? 'var(--danger)'
                  : 'var(--primary)',
            }}
          >
            <div className="flex items-center gap-2.5">
              {toast.type === 'success' && <CheckmarkCircle02Icon className="w-5 h-5 text-success shrink-0" />}
              {toast.type === 'danger' && <Alert01Icon className="w-5 h-5 text-danger shrink-0" />}
              {toast.type === 'info' && <InformationCircleIcon className="w-5 h-5 text-primary shrink-0" />}
              <span className="font-semibold">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              type="button"
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-primary/5 text-text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent active:scale-95 min-h-[44px] min-w-[44px] transition-all"
              aria-label="Dismiss notification"
            >
              <Cancel01Icon className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
