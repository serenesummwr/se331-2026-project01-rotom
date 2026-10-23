<script setup lang="ts">
import axios from 'axios'
import { computed, ref } from 'vue'
import BaseCard from '@/components/shared/BaseCard.vue'
import BaseButton from '@/components/shared/BaseButton.vue'
import UserInfo from '@/components/shared/UserInfo.vue'
import UserEditForm from '@/components/shared/UserEditForm.vue'
import ProfileAvatarEditor from '@/components/shared/ProfileAvatarEditor.vue'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/users'
import { useLevelStore } from '@/stores/levels'
import type { UserEditable } from '@/types'

interface ApiError {
  message?: string
  fieldErrors?: {
    field: string
    message: string
  }[]
}

const auth = useAuthStore()
const userStore = useUserStore()
const levelStore = useLevelStore()

const editing = ref(false)
const saving = ref(false)
const uploadingPhoto = ref(false)
const saved = ref(false)
const error = ref('')
const fieldErrors = ref<string[]>([])

const busy = computed(
  () => saving.value || uploadingPhoto.value,
)

const levelName = computed(() =>
  auth.currentUser
    ? levelStore.levelName(auth.currentUser.level)
    : '',
)

function startEditing() {
  saved.value = false
  error.value = ''
  fieldErrors.value = []
  editing.value = true
}

function cancelEditing() {
  if (busy.value) return

  editing.value = false
  error.value = ''
  fieldErrors.value = []
}

async function save(values: UserEditable) {
  if (!auth.currentUser || busy.value) return

  saving.value = true
  saved.value = false
  error.value = ''
  fieldErrors.value = []

  try {
    await auth.updateProfile(values)

    editing.value = false
    saved.value = true
  } catch (cause: unknown) {
    if (axios.isAxiosError<ApiError>(cause)) {
      const data = cause.response?.data

      error.value = cause.response
        ? data?.message || 'Unable to save your profile.'
        : 'Unable to connect to the server. Please try again.'

      fieldErrors.value = (data?.fieldErrors ?? []).map(
        (item) => `${item.field}: ${item.message}`,
      )
    } else {
      error.value = 'Unable to save your profile. Please try again.'
    }
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <BaseCard
    v-if="auth.currentUser"
    :title="editing ? 'Edit profile' : 'My details'"
    :subtitle="
      editing
        ? 'Update your photo and personal information.'
        : 'Your personal and contact information.'
    "
  >
    <template #actions>
      <BaseButton
        v-if="!editing"
        size="sm"
        variant="secondary"
        @click="startEditing"
      >
        Edit profile
      </BaseButton>
    </template>

    <p
      v-if="saved && !editing"
      role="status"
      class="bg-success/10 text-success mb-5 rounded-lg px-3.5 py-2.5 text-xs font-medium"
    >
      Your profile has been updated.
    </p>

    <div
      v-if="error"
      role="alert"
      class="bg-danger/10 text-danger mb-5 rounded-lg px-3.5 py-2.5 text-sm"
    >
      <p>{{ error }}</p>

      <ul
        v-if="fieldErrors.length"
        class="mt-2 list-disc space-y-1 pl-5 text-xs"
      >
        <li
          v-for="message in fieldErrors"
          :key="message"
        >
          {{ message }}
        </li>
      </ul>
    </div>

    <template v-if="editing">
      <ProfileAvatarEditor
        :disabled="saving"
        @uploading="uploadingPhoto = $event"
      />

      <UserEditForm
        :user="auth.currentUser"
        :provinces="userStore.provinceOptions"
        :saving="busy"
        @save="save"
        @cancel="cancelEditing"
      />
    </template>

    <UserInfo
      v-else
      :user="auth.currentUser"
      :level-name="levelName"
    />
  </BaseCard>
</template>