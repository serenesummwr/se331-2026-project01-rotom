<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import BaseCard from '@/components/shared/BaseCard.vue'
import BaseButton from '@/components/shared/BaseButton.vue'
import UserInfo from '@/components/shared/UserInfo.vue'
import { useUserStore } from '@/stores/users'
import { useLevelStore } from '@/stores/levels'

const route = useRoute()
const userStore = useUserStore()
const levelStore = useLevelStore()
const user = computed(() => userStore.byId(Number(route.params.id)))

const confirming = ref(false)
function applyStatusChange() {
  if (!user.value) return
  userStore.toggleActive(user.value.id)
  confirming.value = false
}
</script>
<template>
  <BaseCard v-if="user" title="Member information">
    <template #actions>
      <RouterLink :to="{ name: 'admin-user-edit', params: { id: String(user.id) } }">
        <BaseButton as="span" size="sm" variant="secondary">Edit</BaseButton>
      </RouterLink>
    </template>
    <UserInfo :user="user" :level-name="levelStore.levelName(user.level)" show-status>
      <template #footer>
        <div v-if="!confirming" class="flex flex-wrap items-center gap-3">
          <BaseButton
            size="sm"
            :variant="user.active ? 'danger' : 'primary'"
            @click="confirming = true"
          >
            {{ user.active ? 'Deactivate this member' : 'Reactivate this member' }}
          </BaseButton>
          <p class="text-muted-foreground text-xs">
            {{
              user.active
                ? 'A deactivated member keeps their level and history but cannot use the Service.'
                : 'Reactivating restores access at the level they already hold.'
            }}
          </p>
        </div>
        <div
          v-else
          class="border-border bg-muted/60 flex flex-wrap items-center gap-3 rounded-xl border p-4"
        >
          <p class="text-foreground min-w-0 flex-1 text-sm">
            {{ user.active ? 'Deactivate' : 'Reactivate' }}
            <strong>{{ user.firstName }} {{ user.lastName }}</strong
            >?
          </p>
          <BaseButton
            size="sm"
            :variant="user.active ? 'danger' : 'primary'"
            @click="applyStatusChange"
          >
            Yes, {{ user.active ? 'deactivate' : 'reactivate' }}
          </BaseButton>
          <BaseButton size="sm" variant="ghost" @click="confirming = false">Cancel</BaseButton>
        </div>
      </template>
    </UserInfo>
  </BaseCard>
</template>
