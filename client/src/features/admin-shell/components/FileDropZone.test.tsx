import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FileDropZone } from './FileDropZone';

function renderZone(acceptedTypes: string[]): {
  onFiles: ReturnType<typeof vi.fn>;
  onRejected: ReturnType<typeof vi.fn>;
  zone: HTMLElement;
} {
  const onFiles = vi.fn();
  const onRejected = vi.fn();
  render(
    <FileDropZone
      id="zone"
      acceptedTypes={acceptedTypes}
      title="Arraste aqui"
      hint="Só CSV"
      onFiles={onFiles}
      onRejected={onRejected}
    />,
  );
  return {
    onFiles,
    onRejected,
    zone: screen.getByText('Arraste aqui').closest('label') as HTMLElement,
  };
}

function dropFiles(zone: HTMLElement, ...files: File[]): void {
  fireEvent.drop(zone, { dataTransfer: { files } });
}

describe('FileDropZone', () => {
  it('delivers a dropped file whose extension is accepted, whatever its case or mime type', () => {
    const { onFiles, zone } = renderZone(['.csv', 'text/csv']);
    const file = new File(['a,b'], 'TIMES.CSV', { type: '' });

    dropFiles(zone, file);

    expect(onFiles).toHaveBeenCalledWith([file]);
  });

  it('refuses a dropped file of another type and says so instead of ignoring it', () => {
    const { onFiles, onRejected, zone } = renderZone(['.csv']);

    dropFiles(zone, new File(['x'], 'foto.png', { type: 'image/png' }));

    expect(onFiles).not.toHaveBeenCalled();
    expect(onRejected).toHaveBeenCalledTimes(1);
  });

  it('takes only the first file when the zone accepts one file at a time', () => {
    const { onFiles, zone } = renderZone(['.csv']);
    const first = new File(['1'], 'a.csv');

    dropFiles(zone, first, new File(['2'], 'b.csv'));

    expect(onFiles).toHaveBeenCalledWith([first]);
  });

  it('matches images by mime type, which is how the photo uploads keep working', () => {
    const { onFiles, zone } = renderZone(['image/png']);
    const photo = new File(['x'], 'foto.png', { type: 'image/png' });

    dropFiles(zone, photo);

    expect(onFiles).toHaveBeenCalledWith([photo]);
  });
});
