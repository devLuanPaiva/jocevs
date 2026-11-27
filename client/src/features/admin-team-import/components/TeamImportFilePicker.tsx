'use client';

import type { ChangeEvent, ReactElement } from 'react';

interface TeamImportFilePickerProps {
  message: string | null;
  onFile: (file: File) => Promise<void>;
}

export function TeamImportFilePicker({
  message,
  onFile,
}: Readonly<TeamImportFilePickerProps>): ReactElement {
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      void onFile(file);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="flex flex-col gap-2 text-sm font-semibold">
        Arquivo CSV
        <input
          type="file"
          accept=".csv,text/csv"
          onChange={handleChange}
          className="min-h-12 rounded-xl border border-admin-line bg-white px-4 py-3 text-base font-normal"
        />
      </label>
      {message ? (
        <p role="alert" className="rounded-xl bg-danger/10 p-4 text-sm font-semibold text-danger">
          {message}
        </p>
      ) : null}
    </div>
  );
}
