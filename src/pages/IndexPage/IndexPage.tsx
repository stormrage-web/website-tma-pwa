import { Title } from '@telegram-apps/telegram-ui';
import type { FC } from 'react';
import { useMemo } from 'react';
import { retrieveLaunchParams } from '@telegram-apps/sdk-react';

export const IndexPage: FC = () => {
  const platform = useMemo(() => {
    // 1) Если TMA — берём платформу из launch params
    try {
      return retrieveLaunchParams().tgWebAppPlatform ?? 'web';
    } catch {
      // 2) Если не TMA, проверяем, работает ли как PWA (standalone)
      const isStandalone =
        (typeof window !== 'undefined' && 'matchMedia' in window && window.matchMedia('(display-mode: standalone)').matches)
        || (typeof navigator !== 'undefined' && (navigator as any).standalone === true);
      return isStandalone ? 'pwa' : 'web';
    }
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '60vh', alignItems: 'center', justifyContent: 'center' }}>
      <Title level="1">UNICORT - platform={platform}</Title>
    </div>
  );
};
