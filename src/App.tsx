import { Suspense } from 'react';
import './i18n';
import AppLayout from './components/layout/AppLayout';

function App() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center text-gray-400">Loading...</div>}>
      <AppLayout />
    </Suspense>
  );
}

export default App;
