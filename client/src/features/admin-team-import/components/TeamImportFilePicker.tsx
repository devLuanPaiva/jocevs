'use client';

import { useState, type ReactElement } from 'react';
import { FileDropZone } from '@/features/admin-shell/components/FileDropZone';

const CSV_TYPES = ['.csv', 'text/csv'];
const NOT_CSV_MESSAGE = 'Escolha um arquivo no formato .csv.';

interface TeamImportFilePickerProps {
  message: string | null;
  onFile: (file: File) => Promise<void>;
}

export function TeamImportFilePicker({
  message,
  onFile,
}: Readonly<TeamImportFilePickerProps>): ReactElement {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isRejected, setIsRejected] = useState(false);
  const shownMessage = isRejected ? NOT_CSV_MESSAGE : message;

  const handleFiles = ([file]: File[]): void => {
    if (file) {
      setIsRejected(false);
      setFileName(file.name);
      void onFile(file);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <FileDropZone
        id="team-import-file"
        isLarge
        acceptedTypes={CSV_TYPES}
        title={fileName ?? 'Arraste o arquivo CSV aqui'}
        hint={
          fileName
            ? 'Arraste outro arquivo ou escolha de novo para trocar a lista.'
            : 'ou escolha o arquivo no seu aparelho. Formato .csv'
        }
        actionLabel={fileName ? 'Trocar arquivo' : 'Escolher arquivo'}
        onFiles={handleFiles}
        onRejected={() => setIsRejected(true)}
      />
      {shownMessage ? (
        <p role="alert" className="rounded-xl bg-danger/10 p-4 text-sm font-semibold text-danger">
          {shownMessage}
        </p>
      ) : null}
    </div>
  );
}
