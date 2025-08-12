// Include Telegram UI styles first to allow our code override the package CSS.
import '@telegram-apps/telegram-ui/dist/styles.css';

import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import { retrieveLaunchParams } from '@telegram-apps/sdk-react';

import { Root } from '@/components/Root.tsx';
import { EnvUnsupported } from '@/components/EnvUnsupported.tsx';
import { init } from '@/init.ts';

import './index.css';

// Mock the environment in case, we are outside Telegram.
import './mockEnv.ts';

const root = ReactDOM.createRoot(document.getElementById('root')!);

let platform: string = 'web';
let debug = import.meta.env.DEV;
let isTmaContext = false;

try {
  const lp = retrieveLaunchParams();
  if (lp && lp.tgWebAppPlatform) {
    isTmaContext = true;
    platform = lp.tgWebAppPlatform;
    debug = (lp.tgWebAppStartParam || '').includes('platformer_debug') || debug;
  }
} catch {
  // not TMA
}

try {
  await init({
    debug,
    eruda: debug && ['ios', 'android'].includes(platform),
    mockForMacOS: platform === 'macos',
  });
  root.render(
    <StrictMode>
      <Root/>
    </StrictMode>,
  );
} catch (e) {
  if (isTmaContext) {
    root.render(<EnvUnsupported/>);
  } else {
    root.render(
      <StrictMode>
        <Root/>
      </StrictMode>,
    );
  }
}

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const base = import.meta.env.BASE_URL || '/';
    const swUrl = (base.endsWith('/') ? base.slice(0, -1) : base) + '/sw.js';
    navigator.serviceWorker.register(swUrl)
      .then((reg) => {
        reg.update().catch(() => void 0);
      })
      .catch(() => void 0);
  });
}
