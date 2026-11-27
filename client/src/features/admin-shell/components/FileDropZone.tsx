'use client';

import { useState, type ChangeEvent, type DragEvent, type ReactElement } from 'react';
import { Icon } from '@/components/ui/Icon';

const DEFAULT_ACTION_LABEL = 'Procurar no aparelho';

export interface FileDropZoneProps {
  id: string;
  name?: string;
  multiple?: boolean;
  disabled?: boolean;
  required?: boolean;
  isLarge?: boolean;
  acceptedTypes: string[];
  title: string;
  hint: string;
  actionLabel?: string;
  invalidMessageId?: string;
  onFiles: (files: File[]) => void;
  onRejected?: () => void;
}

type DropOptions = Pick<
  FileDropZoneProps,
  'name' | 'multiple' | 'disabled' | 'acceptedTypes' | 'onFiles' | 'onRejected'
>;

function extensionOf(file: File): string {
  return `.${file.name.split('.').pop()?.toLowerCase() ?? ''}`;
}

function isAccepted(file: File, acceptedTypes: string[]): boolean {
  return acceptedTypes.some((type) =>
    type.startsWith('.') ? type === extensionOf(file) : type === file.type,
  );
}

function putFilesInInput(input: HTMLInputElement, files: File[]): void {
  const transfer = new DataTransfer();
  files.forEach((file) => transfer.items.add(file));
  input.files = transfer.files;
}

interface DropHandlers {
  isDragging: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onDrop: (event: DragEvent<HTMLLabelElement>) => void;
  onDragOver: (event: DragEvent<HTMLLabelElement>) => void;
  onDragLeave: () => void;
}

function useFileDrop(options: Readonly<DropOptions>): DropHandlers {
  const { name, multiple = false, disabled = false, acceptedTypes, onFiles, onRejected } = options;
  const [isDragging, setIsDragging] = useState(false);

  const deliver = (received: FileList | File[]): File[] => {
    const accepted = Array.from(received).filter((file) => isAccepted(file, acceptedTypes));
    const files = multiple ? accepted : accepted.slice(0, 1);
    if (files.length > 0) {
      onFiles(files);
    } else if (received.length > 0) {
      onRejected?.();
    }
    return files;
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>): void => {
    deliver(event.target.files ?? []);
    if (!name) {
      event.target.value = '';
    }
  };

  const onDrop = (event: DragEvent<HTMLLabelElement>): void => {
    event.preventDefault();
    setIsDragging(false);
    if (disabled) {
      return;
    }
    const files = deliver(event.dataTransfer.files);
    const input = event.currentTarget.control;
    if (name && input instanceof HTMLInputElement && files.length > 0) {
      putFilesInInput(input, files);
    }
  };

  const onDragOver = (event: DragEvent<HTMLLabelElement>): void => {
    event.preventDefault();
    setIsDragging(!disabled);
  };

  return { isDragging, onChange, onDrop, onDragOver, onDragLeave: () => setIsDragging(false) };
}

interface ZoneStyle {
  isDragging: boolean;
  isLarge?: boolean;
  disabled?: boolean;
}

function zoneClassName({ isDragging, isLarge, disabled }: ZoneStyle): string {
  const state = isDragging
    ? 'border-brand-500 bg-brand-500/10'
    : 'border-admin-line bg-white hover:border-brand-500 hover:bg-brand-500/5';
  const size = isLarge ? 'min-h-56 py-10' : 'min-h-40 py-6';
  const cursor = disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer';
  return `group flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-4 text-center transition-colors focus-within:ring-2 focus-within:ring-brand-500/40 ${size} ${state} ${cursor}`;
}

export function FileDropZone(props: Readonly<FileDropZoneProps>): ReactElement {
  const { id, name, multiple, disabled, required, actionLabel = DEFAULT_ACTION_LABEL } = props;
  const drop = useFileDrop(props);

  return (
    <label
      htmlFor={id}
      onDragOver={drop.onDragOver}
      onDragLeave={drop.onDragLeave}
      onDrop={drop.onDrop}
      className={zoneClassName({ ...props, isDragging: drop.isDragging })}
    >
      <span className="flex size-14 items-center justify-center rounded-full bg-brand-500/10 text-brand-600 transition-transform group-hover:-translate-y-1">
        <Icon name="upload" className="size-7" />
      </span>
      <span className="flex flex-col gap-1">
        <span className="font-semibold">{props.title}</span>
        <span className="text-sm text-admin-muted">{props.hint}</span>
      </span>
      <span className="rounded-full border border-admin-line bg-admin-surface px-4 py-1.5 text-sm font-semibold text-brand-700">
        {actionLabel}
      </span>
      <input
        id={id}
        name={name}
        type="file"
        accept={props.acceptedTypes.join(',')}
        multiple={multiple}
        disabled={disabled}
        required={required}
        aria-describedby={props.invalidMessageId}
        onChange={drop.onChange}
        className="sr-only"
      />
    </label>
  );
}
