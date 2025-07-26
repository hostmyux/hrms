import { toast as sonnerToast } from 'sonner';

// Helper function to maintain backward compatibility with old toast format
export const toast = (arg: string | { title: string; description?: string; variant?: string }) => {
  if (typeof arg === 'string') {
    sonnerToast(arg);
  } else {
    const { title, description, variant } = arg;
    if (variant === 'destructive') {
      sonnerToast.error(title, { description });
    } else {
      sonnerToast(title, { description });
    }
  }
};

export { sonnerToast };