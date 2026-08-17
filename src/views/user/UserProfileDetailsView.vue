<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseCard from '@/components/shared/BaseCard.vue'
import BaseButton from '@/components/shared/BaseButton.vue'
import UserInfo from '@/components/shared/UserInfo.vue'
import UserEditForm from '@/components/shared/UserEditForm.vue'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/users'
import { useLevelStore } from '@/stores/levels'
import type { UserEditable } from '@/types'

const auth = useAuthStore()
const userStore = useUserStore()
const levelStore = useLevelStore()
const editing = ref(false)
const saved = ref(false)
const levelName = computed(() =>
  auth.currentUser ? levelStore.levelName(auth.currentUser.level) : '',
)
function save(values: UserEditable) {
  if (!auth.currentUser) return
  userStore.updateUser(auth.currentUser.id, values)
  editing.value = false
  saved.value = true
}
</script>
<template>
  <BaseCard
    v-if="auth.currentUser"
    :title="editing ? 'Edit my details' : 'My details'"
    :subtitle="
      editing
        ? 'The same form the administrator uses'
        : 'The same view the administrator sees, minus the account status'
    "
  >
    <template #actions>
      <BaseButton v-if="!editing" size="sm" variant="secondary" @click="editing = true">
        Edit details
      </BaseButton>
    </template>
    <p
      v-if="saved && !editing"
      class="bg-success/10 text-success mb-5 rounded-lg px-3.5 py-2.5 text-xs font-medium"
    >
      Saved. Your name in the top-right profile updated at the same moment.
    </p>
    <UserEditForm
      v-if="editing"
      :user="auth.currentUser"
      :provinces="userStore.provinceOptions"
      @save="save"
      @cancel="editing = false"
    />
    <UserInfo v-else :user="auth.currentUser" :level-name="levelName" />
  </BaseCard>
</template>