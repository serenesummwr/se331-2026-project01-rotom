<script setup lang="ts">
import axios from 'axios'
import { computed, onBeforeUnmount, ref } from 'vue'
import { UserRound } from 'lucide-vue-next'
import BaseButton from './BaseButton.vue'
import { useAuthStore } from '@/stores/auth'

const props = withDefaults(
  defineProps<{
    disabled?: boolean
  }>(),
  {
    disabled: false,
  },
)

const emit = defineEmits<{
  uploading: [value: boolean]
}>()

const auth = useAuthStore()

const fileInput = ref<HTMLInputElement | null>(null)
const previewUrl = ref('')
const uploading = ref(false)
const error = ref('')
const saved = ref(false)

const imageUrl = computed(
  () => previewUrl.value || auth.currentUser?.avatar || '',
)

const busy = computed(() => props.disabled || uploading.value)

function releasePreview() {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = ''
  }
}

function choosePhoto() {
  if (busy.value) return

  fileInput.value?.click()
}

async function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  input.value = ''

  if (!file || busy.value) return

  error.value = ''
  saved.value = false

  if (!['image/jpeg', 'image/png'].includes(file.type)) {
    error.value = 'Please select a JPG or PNG image.'
    return
  }

  if (file.size === 0) {
    error.value = 'The selected file is empty.'
    return
  }

  if (file.size > 2 * 1024 * 1024) {
    error.value = 'Profile photo must not exceed 2 MB.'
    return
  }

  releasePreview()
  previewUrl.value = URL.createObjectURL(file)

  uploading.value = true
  emit('uploading', true)

  try {
    await auth.uploadAvatar(file)
    saved.value = true
  } catch (cause: unknown) {
    if (axios.isAxiosError<{ message?: string }>(cause)) {
      error.value = cause.response
        ? cause.response.data?.message || 'Unable to upload your photo.'
        : 'Unable to connect to the server. Please try again.'
    } else {
      error.value = 'Unable to upload your photo. Please try again.'
    }
  } finally {
    releasePreview()
    uploading.value = false
    emit('uploading', false)
  }
}

onBeforeUnmount(releasePreview)
</script>

<template>
  <div
    v-if="auth.currentUser"
    class="mb-6"
    :aria-busy="uploading"
  >
    <div class="flex items-center gap-4">
      <div
        class="border-border bg-muted flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border"
      >
        <img
          v-if="imageUrl"
          :src="imageUrl"
          alt="Profile photo"
          class="size-full object-cover"
        />

        <UserRound
          v-else
          class="text-muted-foreground size-7"
          :stroke-width="1.5"
          aria-hidden="true"
        />
      </div>

      <div class="min-w-0">
        <BaseButton
          type="button"
          variant="secondary"
          size="sm"
          :disabled="busy"
          aria-describedby="profile-photo-help"
          @click="choosePhoto"
        >
          {{ uploading ? 'Uploading…' : 'Change photo' }}
        </BaseButton>

        <p
          id="profile-photo-help"
          class="text-muted-foreground mt-2 text-xs leading-relaxed"
        >
          JPG or PNG · Up to 2 MB
          <br />
          Photo changes are saved immediately.
        </p>
      </div>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept="image/jpeg,image/png"
      class="hidden"
      :disabled="busy"
      aria-label="Change profile photo"
      @change="onFileChange"
    />

    <p
      v-if="error"
      role="alert"
      class="text-danger mt-3 text-xs"
    >
      {{ error }}
    </p>

    <p
      v-if="saved"
      role="status"
      class="text-success mt-3 text-xs"
    >
      Photo updated.
    </p>
  </div>
</template>