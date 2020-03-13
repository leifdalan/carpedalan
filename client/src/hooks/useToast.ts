import debug from 'debug';
import { useState, useEffect, useCallback } from 'react';

import { RetryTuple } from 'hooks/types';
/**
 * @TODO figure out this `any`..... Can't use union types
 */

interface Toast {
  message: string;
  onRetry?: () => void;
  onDismiss: () => void;
  id: number;
}

const TOAST_TIMEOUT = 10000;
let globalToasts: Toast[] = [];
type SetGlobalToast = (toastMessage: Toast[]) => void;

let setters: SetGlobalToast[] = [];

function setGlobalToasts(toasts: Toast[]) {
  setters.forEach(setter => {
    globalToasts = toasts;
    setter(globalToasts);
  });
}
let count = 0;
const log = debug('hooks:useToast');

export default function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  if (!setters.includes(setToasts)) {
    setters.push(setToasts);
  }

  useEffect(() => {
    return () => {
      setters = setters.filter(setter => setter !== setToasts);
    };
  }, []);

  const addToast = useCallback(
    ({ message, retryTuple }: { message: string; retryTuple?: RetryTuple }) => {
      count += 1;
      const id = count;
      function onDismiss() {
        const newGlobal = globalToasts.filter(toast => toast.id !== id);
        setGlobalToasts(newGlobal);
      }
      async function onRetry() {
        const [request, args] = retryTuple || [];
        onDismiss();
        await request?.call(null, args);
      }

      setTimeout(onDismiss, TOAST_TIMEOUT);
      setGlobalToasts([
        ...globalToasts,
        {
          message,
          onDismiss,
          onRetry,
          id,
        },
      ]);
    },
    [],
  );
  return { addToast, toasts };
}
