'use client'

import { X, FileText, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface UploadedFile {
  id: string
  name: string
  type: string
  size: number
}

interface FileUploadChipsProps {
  files: UploadedFile[]
  onRemove: (fileId: string) => void
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function FileChip({ file, onRemove }: { file: UploadedFile; onRemove: () => void }) {
  const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf')
  const isImage = file.type.startsWith('image/')

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted border border-border text-sm">
      {isPdf ? (
        <FileText className="h-4 w-4 text-red-400" />
      ) : isImage ? (
        <ImageIcon className="h-4 w-4 text-blue-400" />
      ) : (
        <FileText className="h-4 w-4 text-muted-foreground" />
      )}
      <span className="max-w-[150px] truncate">{file.name}</span>
      <span className="text-xs text-muted-foreground">
        {formatFileSize(file.size)}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-5 w-5 p-0 hover:bg-destructive/20"
        onClick={onRemove}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  )
}

export function FileUploadChips({ files, onRemove }: FileUploadChipsProps) {
  if (files.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 mb-3">
      {files.map((file) => (
        <FileChip
          key={file.id}
          file={file}
          onRemove={() => onRemove(file.id)}
        />
      ))}
    </div>
  )
}
