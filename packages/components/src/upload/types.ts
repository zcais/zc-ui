export interface UploadFile {
  uid: number | string
  name: string
  url?: string
  status?: 'ready' | 'uploading' | 'success' | 'error'
  size?: number
  raw?: File
  percentage?: number
  response?: unknown
}

export interface UploadRequestOptions {
  file: File
  action: string
  headers?: Record<string, string>
  data?: Record<string, unknown>
  withCredentials?: boolean
  onProgress?: (event: { percent: number }) => void
  onSuccess?: (response: unknown) => void
  onError?: (err: Error) => void
}

export type UploadListType = 'text' | 'picture' | 'picture-card'
export type UploadTrigger = 'click' | 'hover'
