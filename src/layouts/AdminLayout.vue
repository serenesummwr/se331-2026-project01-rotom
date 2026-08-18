<script setup lang="ts">
import { Layers, LayoutDashboard, Users } from 'lucide-vue-next'
import AppShell from './AppShell.vue'
import type { NavItem, ProfileLink } from '@/types'

const nav: NavItem[] = [
  { label: 'Overview', icon: LayoutDashboard, to: { name: 'admin-dashboard' }, exact: true },
  { label: 'Members', icon: Users, to: { name: 'admin-users' } },
  { label: 'Levels', icon: Layers, to: { name: 'admin-levels' } },
]
const profileLinks: ProfileLink[] = [
  { label: 'Admin overview', to: { name: 'admin-dashboard' } },
  { label: 'Member directory', to: { name: 'admin-users' } },
  { label: 'Levels and exams', to: { name: 'admin-levels' } },
]
</script>
<template>
  <AppShell :nav="nav" :profile-links="profileLinks" />
</template>
