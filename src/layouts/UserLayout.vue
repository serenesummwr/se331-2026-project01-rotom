<script setup lang="ts">
import { CirclePlay, FileText, Stamp } from 'lucide-vue-next'
import AppShell from './AppShell.vue'
import type { NavItem, ProfileLink } from '@/types'
const nav: NavItem[] = [
  { label: 'My passport', icon: Stamp, to: { name: 'user-dashboard' }, exact: true },
  { label: 'ELearning', icon: CirclePlay, to: { name: 'user-elearning' } },
  { label: 'Exam', icon: FileText, to: { name: 'user-exam' } },

]
const profileLinks: ProfileLink[] = [
]
</script>
<template>
  <AppShell :nav="nav" :profile-links="profileLinks" />
</template>