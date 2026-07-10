import React from 'react';
import { useUiStore } from '../app/uiStore';
import type { ToastItem } from '../app/uiStore';
import { Cancel01Icon, CheckmarkCircle02Icon, AlertCircleIcon, InformationCircleIcon } from 'hugeicons-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useUiStore();

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none"
      aria-live="assertive"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

interface ToastProps {
  toast: ToastItem;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  // Contrast Self-Checks:
  // - Toast background: bg-surface (#fbf6ea in light, #1b2416 in dark)
  // - Text content: text-text (#18542a in light, #f3e8cc in dark) = Passes WCAG AAA
  // - Icon/Border accent: border-l-4 success (#9abc05 / #b6dc3a) or danger (#d52518 / #ff6a5c)

  const borderColors = {
    success: 'border-success',
    danger: 'border-danger',
    info: 'border-primary',
  };

  const role = toast.type === 'danger' ? 'alert' : 'status';

  return (
    <div
      role={role}
      className={`pointer-events-auto flex items-center justify-between p-4 rounded bg-surface border-l-4 ${borderColors[toast.type]} shadow-lg text-text font-sans text-sm gap-3 animate-slide-in motion-reduce:animate-none`}
    >
      <div className="flex items-center gap-2.5">
        {toast.type === 'success' && <CheckmarkCircle02Icon className="w-5 h-5 text-success shrink-0" />}
        {toast.type === 'danger' && <AlertCircleIcon className="w-5 h-5 text-danger shrink-0" />}
        {toast.type === 'info' && <InformationCircleIcon className="w-5 h-5 text-primary shrink-0" />}
        <span>{toast.message}</span>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss notification"
        className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-primary/5 text-text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent active:scale-95 min-h-[44px] min-w-[44px]"
      >
        <Cancel01Icon className="w-4 h-4" />
      </button>
    </div>
  );
};
