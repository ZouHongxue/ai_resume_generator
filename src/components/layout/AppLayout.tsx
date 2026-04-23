import { useState } from 'react';
import Header from './Header';
import ResumeEditor from '../editor/ResumeEditor';
import ResumePreview from '../preview/ResumePreview';
import ImportModal from '../import/ImportModal';
import SettingsModal from '../settings/SettingsModal';
import { useResumeStore } from '../../store/resumeStore';

export default function AppLayout() {
  const [importOpen, setImportOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');
  const resetResume = useResumeStore((s) => s.resetResume);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header
        onImport={() => setImportOpen(true)}
        onSettings={() => setSettingsOpen(true)}
        onNewResume={resetResume}
      />

      {/* Mobile view toggle */}
      <div className="flex md:hidden border-b border-gray-200 bg-white no-print">
        <button
          onClick={() => setMobileView('editor')}
          className={`flex-1 py-2 text-sm font-medium text-center cursor-pointer ${
            mobileView === 'editor' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
          }`}
        >
          Editor
        </button>
        <button
          onClick={() => setMobileView('preview')}
          className={`flex-1 py-2 text-sm font-medium text-center cursor-pointer ${
            mobileView === 'preview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
          }`}
        >
          Preview
        </button>
      </div>

      {/* Desktop: split pane | Mobile: toggle */}
      <div className="flex-1 flex overflow-hidden">
        <div
          className={`w-full md:w-1/2 overflow-y-auto border-r border-gray-200 bg-white ${
            mobileView !== 'editor' ? 'hidden md:block' : ''
          }`}
        >
          <ResumeEditor />
        </div>
        <div
          className={`w-full md:w-1/2 overflow-y-auto bg-gray-100 flex justify-center p-4 ${
            mobileView !== 'preview' ? 'hidden md:block' : ''
          }`}
        >
          <ResumePreview />
        </div>
      </div>

      <ImportModal open={importOpen} onClose={() => setImportOpen(false)} />
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
