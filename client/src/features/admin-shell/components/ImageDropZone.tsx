'use client';

import type { ReactElement } from 'react';
import { FileDropZone, type FileDropZoneProps } from './FileDropZone';

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

type ImageDropZoneProps = Omit<FileDropZoneProps, 'acceptedTypes' | 'isLarge' | 'onRejected'>;

export function ImageDropZone(props: Readonly<ImageDropZoneProps>): ReactElement {
  return <FileDropZone {...props} acceptedTypes={IMAGE_TYPES} />;
}
