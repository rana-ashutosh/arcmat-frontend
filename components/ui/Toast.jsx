'use client';

import { toast as sonnerToast } from 'sonner';

export const toast = {
  success: (message, title) =>
    sonnerToast.success(title || message, {
      description: title ? message : undefined,
    }),
  error: (message, title) =>
    sonnerToast.error(title || message, {
      description: title ? message : undefined,
    }),
  warning: (message, title) =>
    sonnerToast.warning(title || message, {
      description: title ? message : undefined,
    }),
  info: (message, title) =>
    sonnerToast.info(title || message, {
      description: title ? message : undefined,
    }),
  ...sonnerToast,
};

export default function Toast() {
  return null;
}