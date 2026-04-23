import { useState, useCallback, type DragEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { ACCEPT_STRING } from '../../lib/parsers';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  loading?: boolean;
  disabled?: boolean;
}

export default function FileUploader({ onFileSelect, loading, disabled }: FileUploaderProps) {
  const { t } = useTranslation();
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect],
  );

  const handleClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = ACCEPT_STRING;
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) onFileSelect(file);
    };
    input.click();
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
        disabled ? 'opacity-40 pointer-events-none cursor-not-allowed' :
        dragOver ? 'border-blue-500 bg-blue-50 cursor-pointer' : 'border-gray-300 hover:border-gray-400 cursor-pointer'
      } ${loading ? 'pointer-events-none opacity-60' : ''}`}
    >
      {loading ? (
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">{t('import.extracting')}</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div className="text-3xl text-gray-300">+</div>
          <p className="text-sm text-gray-600">{t('import.dragDrop')}</p>
          <p className="text-xs text-gray-400">{t('import.supportedFormats')}</p>
        </div>
      )}
    </div>
  );
}
