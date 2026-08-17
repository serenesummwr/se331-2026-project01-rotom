<script setup lang="ts">
import { CirclePlay, FileText, Stamp, User } from 'lucide-vue-next'
import AppShell from './AppShell.vue'
import type { NavItem, ProfileLink } from '@/types'
const nav: NavItem[] = [
  { label: 'My passport', icon: Stamp, to: { name: 'user-dashboard' }, exact: true },
    { label: 'ELearning', icon: CirclePlay, to: { name: 'user-elearning' } },
    { label: 'Exam', icon: FileText, to: { name: 'user-exam' } },
    { label: 'Profile', icon: User, to: { name: 'user-profile-details' } },
]
const profileLinks: ProfileLink[] = [
    { label: 'My details', to: { name: 'user-profile-details' } },
  { label: 'Exam history', to: { name: 'user-profile-history' } },
  { label: 'Badges', to: { name: 'user-profile-badges' } },
  { label: 'Available services', to: { name: 'user-profile-services' } },
]
</script>
<template>
  <AppShell :nav="nav" :profile-links="profileLinks" />
</template>