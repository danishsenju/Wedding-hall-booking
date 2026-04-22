'use client';

import { useState, useEffect, type ComponentType } from 'react';
import type { SilkProps } from './Silk';

export default function SilkBackground() {
  const [silk, setSilk] = useState<{ Component: ComponentType<SilkProps> } | null>(null);
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    import('./Silk').then((mod) => setSilk({ Component: mod.default }));

    function onVisibility() {
      setTabVisible(document.visibilityState === 'visible');
    }
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  if (!silk || !tabVisible) return null;
  const { Component: Silk } = silk;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Silk speed={1.5} scale={1.2} color="#4C1D95" noiseIntensity={1.0} rotation={0} />
    </div>
  );
}
