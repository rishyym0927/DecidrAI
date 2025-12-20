/**
 * Web Vitals Provider
 * Initializes Web Vitals reporting on client
 */

'use client';

import { useEffect } from 'react';
import { reportWebVitals } from '@/lib/webVitals';

export function WebVitalsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    reportWebVitals();
  }, []);

  return <>{children}</>;
}
