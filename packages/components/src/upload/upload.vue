<script setup lang="ts">
import { computed, onBeforeUnmount, ref, shallowRef } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import { useLocale } from '@zc-ui/locale'
import type { UploadFile, UploadRequestOptions } from './types'

defineOptions({ name: 'ZcUpload' })

const props = withDefaults(
  defineProps<{
    modelValue?: UploadFile[]
    action?: string
    multiple?: boolean
    accept?: string
    disabled?: boolean
    limit?: number
    autoUpload?: boolean
    withCredentials?: boolean
    headers?: Record<string, string>
    data?: Record<string, unknown>
    name?: string
    drag?: boolean
    listType?: 'text' | 'picture' | 'picture-card'
    showFileList?: boolean
    httpRequest?: (options: UploadRequestOptions) => void
    beforeUpload?: (file: File) => boolean | Promise<boolean>
    onRemove?: (file: UploadFile) => boolean | Promise<boolean>
  }>(),
  {
    modelValue: () => [],
    action: '#',
    multiple: false,
    accept: '',
    disabled: false,
    limit: 0,
    autoUpload: true,
    withCredentials: false,
    headers: () => ({}),
    data: () => ({}),
    name: 'file',
    drag: false,
    listType: 'text',
    showFileList: true,
    httpRequest: undefined,
    beforeUpload: undefined,
    onRemove: undefined,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', files: UploadFile[]): void
  (e: 'change', file: UploadFile, fileList: UploadFile[]): void
  (e: 'success', response: unknown, file: UploadFile, fileList: UploadFile[]): void
  (e: 'error', error: Error, file: UploadFile, fileList: UploadFile[]): void
  (e: 'progress', event: { percent: number }, file: UploadFile): void
  (e: 'remove', file: UploadFile, fileList: UploadFile[]): void
  (e: 'exceed', files: File[], fileList: UploadFile[]): void
}>()

const ns = useNamespace('upload')
const { t } = useLocale()
const inputRef = shallowRef<HTMLInputElement>()
const dragOver = ref(false)

const fileList = computed<UploadFile[]>({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const classes = computed(() => [
  ns.b(),
  ns.is('drag', props.drag),
  ns.is('disabled', props.disabled),
])

const listClasses = computed(() => [ns.e('list'), ns.em('list', props.listType)])

let uidSeed = Date.now()

/** Check if a URL is a blob/object URL created by URL.createObjectURL */
function isObjectUrl(url?: string): url is string {
  return !!url && url.startsWith('blob:')
}

/** Revoke a single file's object URL if it has one */
function revokeFileUrl(file: UploadFile) {
  if (isObjectUrl(file.url)) {
    URL.revokeObjectURL(file.url)
  }
}

/** Revoke all object URLs in the current file list */
function revokeAllObjectUrls() {
  fileList.value.forEach(revokeFileUrl)
}

/**
 * Immutably update a single file in the list.
 * Returns the new file object — never mutates the original.
 */
function updateFile(file: UploadFile, updates: Partial<UploadFile>): UploadFile {
  const updatedFile = { ...file, ...updates }
  const newList = fileList.value.map((f) => (f.uid === file.uid ? updatedFile : f))
  fileList.value = newList
  return updatedFile
}

// Cleanup all blob URLs when the component unmounts
onBeforeUnmount(revokeAllObjectUrls)

// ---- Trigger ----
function handleClick() {
  if (props.disabled) return
  inputRef.value?.click()
}

function handleInputChange(event: Event) {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (!files || files.length === 0) return

  uploadFiles(Array.from(files))

  // Reset input so same file can be re-selected
  target.value = ''
}

async function uploadFiles(files: File[]) {
  if (props.limit > 0 && fileList.value.length + files.length > props.limit) {
    emit('exceed', files, fileList.value)
    return
  }

  for (const rawFile of files) {
    // beforeUpload hook
    if (props.beforeUpload) {
      const result = await props.beforeUpload(rawFile)
      if (result === false) continue
    }

    const file: UploadFile = {
      uid: ++uidSeed,
      name: rawFile.name,
      status: 'ready',
      size: rawFile.size,
      raw: rawFile,
      percentage: 0,
    }

    if (props.listType === 'picture' || props.listType === 'picture-card') {
      if (rawFile.type.startsWith('image/')) {
        file.url = URL.createObjectURL(rawFile)
      }
    }

    const newFileList = [...fileList.value, file]
    fileList.value = newFileList
    emit('change', file, newFileList)

    if (props.autoUpload) {
      doUpload(file)
    }
  }
}

function doUpload(file: UploadFile) {
  if (!file.raw) return

  // Use immutable updates instead of mutating props-derived objects
  let currentFile = updateFile(file, { status: 'uploading', percentage: 0 })

  const options: UploadRequestOptions = {
    file: file.raw,
    action: props.action,
    headers: props.headers,
    data: props.data,
    withCredentials: props.withCredentials,
    onProgress: (event) => {
      currentFile = updateFile(currentFile, { percentage: Math.floor(event.percent) })
      emit('progress', event, currentFile)
    },
    onSuccess: (response) => {
      currentFile = updateFile(currentFile, { status: 'success', percentage: 100, response })
      emit('success', response, currentFile, fileList.value)
    },
    onError: (error) => {
      currentFile = updateFile(currentFile, { status: 'error' })
      emit('error', error, currentFile, fileList.value)
    },
  }

  if (props.httpRequest) {
    props.httpRequest(options)
  } else {
    defaultRequest(options)
  }
}

// ---- Default XHR implementation ----
function defaultRequest(options: UploadRequestOptions) {
  const xhr = new XMLHttpRequest()

  xhr.upload.onprogress = (e) => {
    if (e.lengthComputable && options.onProgress) {
      options.onProgress({ percent: (e.loaded / e.total) * 100 })
    }
  }

  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      let response: unknown
      try {
        response = JSON.parse(xhr.responseText)
      } catch {
        response = xhr.responseText
      }
      options.onSuccess?.(response)
    } else {
      options.onError?.(new Error(`HTTP ${xhr.status}`))
    }
  }

  xhr.onerror = () => {
    options.onError?.(new Error('Network error'))
  }

  const formData = new FormData()
  formData.append(props.name, options.file)

  if (options.data) {
    for (const [key, value] of Object.entries(options.data)) {
      formData.append(key, String(value))
    }
  }

  xhr.open('POST', options.action)
  if (options.withCredentials) {
    xhr.withCredentials = true
  }
  if (options.headers) {
    for (const [key, value] of Object.entries(options.headers)) {
      xhr.setRequestHeader(key, value)
    }
  }
  xhr.send(formData)
}

// ---- Remove ----
async function removeFile(file: UploadFile) {
  if (props.onRemove) {
    const result = await props.onRemove(file)
    if (result === false) return
  }

  const index = fileList.value.indexOf(file)
  if (index > -1) {
    // Revoke the object URL to prevent memory leaks
    revokeFileUrl(file)

    const newList = [...fileList.value]
    newList.splice(index, 1)
    fileList.value = newList
    emit('remove', file, newList)
  }
}

// ---- Drag & Drop ----
function handleDrop(event: DragEvent) {
  event.preventDefault()
  dragOver.value = false
  if (props.disabled) return

  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    uploadFiles(Array.from(files))
  }
}

function handleDragOver(event: DragEvent) {
  event.preventDefault()
  dragOver.value = true
}

function handleDragLeave() {
  dragOver.value = false
}

// ---- Manual submit ----
function submit() {
  fileList.value.filter((f) => f.status === 'ready').forEach((f) => doUpload(f))
}

defineExpose({
  submit,
  clearFiles: () => {
    revokeAllObjectUrls()
    fileList.value = []
  },
})
</script>

<template>
  <div :class="classes">
    <!-- Drag area or click trigger -->
    <div
      v-if="drag"
      :class="[ns.e('dragger'), ns.is('dragover', dragOver)]"
      @click="handleClick"
      @drop="handleDrop"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
    >
      <svg
        viewBox="0 0 24 24"
        width="40"
        height="40"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        style="color: var(--color-zc-text-placeholder, #a8abb2); margin-bottom: 8px"
      >
        <path
          d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <polyline points="17 8 12 3 7 8" stroke-linecap="round" stroke-linejoin="round" />
        <line x1="12" y1="3" x2="12" y2="15" stroke-linecap="round" />
      </svg>
      <div :class="ns.e('dragger-text')">
        {{ t('zc.upload.dragTip') }}<em>{{ t('zc.upload.clickToUpload') }}</em>
      </div>
      <slot name="tip" />
    </div>

    <!-- Non-drag trigger -->
    <div v-else :class="ns.e('trigger')" @click="handleClick">
      <slot />
      <slot name="trigger" />
    </div>

    <input
      ref="inputRef"
      :class="ns.e('input')"
      type="file"
      :multiple="multiple"
      :accept="accept"
      :disabled="disabled"
      @change="handleInputChange"
    />

    <!-- File list -->
    <transition-group v-if="showFileList" tag="ul" :class="listClasses" name="zc-upload-list">
      <li
        v-for="file in fileList"
        :key="file.uid"
        :class="[ns.e('file'), ns.is(file.status || 'ready')]"
      >
        <!-- Picture card thumbnail -->
        <template v-if="listType === 'picture-card'">
          <div :class="ns.e('file-card')">
            <img v-if="file.url" :src="file.url" :class="ns.e('file-thumb')" :alt="file.name" />
            <div v-else :class="ns.e('file-icon')">
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div v-if="file.status === 'uploading'" :class="ns.e('file-overlay')">
              <div :class="ns.e('progress-bar')">
                <div
                  :class="ns.e('progress-inner')"
                  :style="{ width: (file.percentage || 0) + '%' }"
                ></div>
              </div>
              <span>{{ file.percentage }}%</span>
            </div>
            <div :class="ns.e('file-actions')">
              <span v-if="file.url" :class="ns.e('file-action')" @click="removeFile(file)">
                <svg
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 8l8 8M16 8l-8 8" stroke-linecap="round" />
                </svg>
              </span>
            </div>
          </div>
        </template>

        <!-- Text / picture list -->
        <template v-else>
          <svg
            v-if="listType === 'picture' && file.url"
            :class="ns.e('file-thumb')"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <image v-if="file.url" :href="file.url" width="24" height="24" />
          </svg>
          <span :class="ns.e('file-name')">{{ file.name }}</span>
          <span v-if="file.status === 'uploading'" :class="ns.e('file-loading')"
            >{{ file.percentage }}%</span
          >
          <span v-if="file.status === 'success'" :class="ns.e('file-success')">✓</span>
          <span v-if="file.status === 'error'" :class="ns.e('file-error')">✕</span>
          <span :class="ns.e('file-remove')" @click="removeFile(file)">✕</span>
        </template>
      </li>
    </transition-group>
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcUpload styles
 * ============================================================ */

.zc-upload {
  display: inline-block;
}

/* Hidden file input */
.zc-upload__input {
  display: none;
}

/* Trigger */
.zc-upload__trigger {
  cursor: pointer;
}

.zc-upload.is-disabled .zc-upload__trigger,
.zc-upload.is-disabled .zc-upload__dragger {
  cursor: not-allowed;
  opacity: 0.6;
}

/* Dragger */
.zc-upload__dragger {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 360px;
  height: 180px;
  border: 2px dashed var(--color-zc-border-base, #dcdfe6);
  border-radius: var(--radius-zc-base, 4px);
  cursor: pointer;
  text-align: center;
  transition: border-color var(--transition-duration-zc-base, 0.25s);
}

.zc-upload__dragger:hover,
.zc-upload__dragger.is-dragover {
  border-color: var(--color-zc-primary-500, #409eff);
  background: var(--color-zc-primary-50, #ecf5ff);
}

.zc-upload__dragger-text {
  color: var(--color-zc-text-secondary, #909399);
  font-size: var(--text-zc-base, 14px);
}

.zc-upload__dragger-text em {
  color: var(--color-zc-primary-500, #409eff);
  font-style: normal;
}

/* File list */
.zc-upload__list {
  list-style: none;
  margin: 8px 0 0;
  padding: 0;
}

/* Text list items */
.zc-upload__list--text .zc-upload__file,
.zc-upload__list--picture .zc-upload__file {
  display: flex;
  align-items: center;
  padding: 6px 8px;
  margin-top: 6px;
  border-radius: var(--radius-zc-base, 4px);
  background: var(--color-zc-fill-light, #f5f7fa);
  font-size: var(--text-zc-base, 14px);
  transition: background var(--transition-duration-zc-fast, 0.15s);
}

.zc-upload__list--text .zc-upload__file:hover,
.zc-upload__list--picture .zc-upload__file:hover {
  background: var(--color-zc-fill-base, #f0f2f5);
}

.zc-upload__file-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--color-zc-text-primary, #303133);
  margin-left: 6px;
}

.zc-upload__file-loading {
  color: var(--color-zc-text-secondary, #909399);
  font-size: var(--text-zc-xs, 12px);
  margin-left: 8px;
}

.zc-upload__file-success {
  color: var(--color-zc-success-500, #67c23a);
  margin-left: 8px;
}

.zc-upload__file-error {
  color: var(--color-zc-danger-500, #f56c6c);
  margin-left: 8px;
}

.zc-upload__file-remove {
  margin-left: 8px;
  cursor: pointer;
  color: var(--color-zc-text-placeholder, #a8abb2);
  transition: color var(--transition-duration-zc-fast, 0.15s);
}

.zc-upload__file-remove:hover {
  color: var(--color-zc-text-primary, #303133);
}

/* Picture card */
.zc-upload__list--picture-card {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.zc-upload__list--picture-card .zc-upload__file {
  list-style: none;
}

.zc-upload__file-card {
  position: relative;
  width: 120px;
  height: 120px;
  border: 1px solid var(--color-zc-border-light, #e4e7ed);
  border-radius: var(--radius-zc-base, 4px);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.zc-upload__file-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.zc-upload__file-icon {
  color: var(--color-zc-text-placeholder, #a8abb2);
}

.zc-upload__file-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--color-zc-white, #fff);
  font-size: var(--text-zc-xs, 12px);
  gap: 6px;
}

.zc-upload__progress-bar {
  width: 80%;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  overflow: hidden;
}

.zc-upload__progress-inner {
  height: 100%;
  background: var(--color-zc-primary-500, #409eff);
  transition: width var(--transition-duration-zc-fast, 0.15s);
}

.zc-upload__file-actions {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity var(--transition-duration-zc-fast, 0.15s);
}

.zc-upload__file-card:hover .zc-upload__file-actions {
  opacity: 1;
}

.zc-upload__file-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  color: var(--color-zc-text-primary, #303133);
  cursor: pointer;
}

/* List transition */
.zc-upload-list-enter-active,
.zc-upload-list-leave-active {
  transition: all var(--transition-duration-zc-base, 0.25s);
}
.zc-upload-list-enter-from,
.zc-upload-list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
