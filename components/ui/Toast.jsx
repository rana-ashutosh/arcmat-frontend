'use client';

import { toast as sonnerToast } from 'sonner';
import CustomToast from './CustomToast';

export const toast = {
  success: (message, title) =>
    sonnerToast.custom((t) => (
      <CustomToast t={t} message={message} title={title} type="success" />
    )),
  error: (message, title) =>
    sonnerToast.custom((t) => (
      <CustomToast t={t} message={message} title={title} type="error" />
    )),
  warning: (message, title) =>
    sonnerToast.custom((t) => (
      <CustomToast t={t} message={message} title={title} type="warning" />
    )),
  info: (message, title) =>
    sonnerToast.custom((t) => (
      <CustomToast t={t} message={message} title={title} type="info" />
    )),
  ...sonnerToast,
};

export default function Toast() {
  return null;
}