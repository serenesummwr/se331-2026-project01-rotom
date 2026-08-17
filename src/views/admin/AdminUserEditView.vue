<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseCard from '@/components/shared/BaseCard.vue'
import UserEditForm from '@/components/shared/UserEditForm.vue'
import { useUserStore } from '@/stores/users'
import type { UserEditable } from '@/types'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const user = computed(() => userStore.byId(Number(route.params.id)))
const saved = ref(false)
function save(values: UserEditable) {
  if (!user.value) return
  userStore.updateUser(user.value.id, values)
  saved.value = true
}
function cancel() {
  router.push({ name: 'admin-user-info', params: { id: route.params.id as string } })
}
</script>
<template>
  <BaseCard
    v-if="user"
    title="Edit member"
    subtitle="The same form the member sees on their own profile"
  >
    <p
      v-if="saved"
      class="bg-success/10 text-success mb-5 rounded-lg px-3.5 py-2.5 text-xs font-medium"
    >
      Saved. The directory, the header and the member's own profile already show the new details.
    </p>
    <UserEditForm
      :user="user"
      :provinces="userStore.provinceOptions"
      @save="save"
      @cancel="cancel"
    />
  </BaseCard>
</template>
