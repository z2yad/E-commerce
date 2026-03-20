import { Injectable } from '@angular/core';
import { toast, type ExternalToast } from 'ngx-sonner';

/**
 * Premium Toast Configuration
 */
const TOAST_CONFIG: ExternalToast = {
  duration: 3000,
  position: 'top-right',
};

const BASE_CLASSES = '!border-none !rounded-xl !p-4 !font-medium font-sans !text-white';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  /**
   * Show a success toast with a premium emerald/teal gradient
   */
  success(message: string, description?: string, actionLabel?: string, onAction?: () => void) {
    this.showToast('success', message, {
      description,
      classes: '!bg-gradient-to-br !from-emerald-500 !to-teal-600 !shadow-[0_10px_30px_-5px_rgba(16,185,129,0.4)]',
      actionLabel,
      onAction,
      position: 'bottom-right'
    });
  }

  /**
   * Show an error toast with a premium red/rose gradient
   */
  error(message: string, description?: string, actionLabel?: string, onAction?: () => void) {
    this.showToast('error', message, {
      description,
      classes: '!bg-gradient-to-br !from-red-500 !to-rose-600 !shadow-[0_10px_30px_-5px_rgba(239,68,68,0.4)]',
      actionLabel,
      onAction,
      position: 'bottom-right'
    });
  }

  /**
   * Show an info toast with a premium blue/cyan gradient
   */
  info(message: string, description?: string) {
    this.showToast('info', message, {
      description,
      classes: '!bg-gradient-to-br !from-blue-500 !to-cyan-600 !shadow-[0_10px_30px_-5px_rgba(59,130,246,0.4)]',
      position: 'bottom-right'
    });
  }

  /**
   * Show a warning toast with a premium amber/orange gradient
   */
  warning(message: string, description?: string) {
    this.showToast('warning', message, {
      description,
      classes: '!bg-gradient-to-br !from-amber-500 !to-orange-600 !shadow-[0_10px_30px_-5px_rgba(245,158,11,0.4)]',
      position: 'bottom-right'
    });
  }

  /**
   * Internal helper to trigger the toast with consistent styling
   */
  private showToast(
    type: 'success' | 'error' | 'info' | 'warning',
    message: string,
    config: {
      description?: string;
      classes: string;
      actionLabel?: string;
      onAction?: () => void;
      position?: string;
    },
  ) {
    const toastFn = toast[type] || toast;

    toastFn(message, {
      ...TOAST_CONFIG,
      position: config.position as any || TOAST_CONFIG.position,
      classes: {
        toast: `${BASE_CLASSES} ${config.classes}`,
      },
      description: config.description,
      action: config.actionLabel ? {
        label: config.actionLabel,
        onClick: config.onAction || (() => toast.dismiss()),
      } : undefined,
    });
  }
}
