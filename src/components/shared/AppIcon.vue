<script setup lang="ts">
import {
  Award,
  ChartColumn,
  Compass,
  Crown,
  FlaskConical,
  Handshake,
  Infinity as InfinityIcon,
  MessageSquare,
  Navigation,
  Newspaper,
  Phone,
  PlaneTakeoff,
  Rocket,
  Shapes,
  Stamp,
  Ticket,
  TrendingUp,
  Video,
  Vote,
  Wallet,
  Zap,
} from 'lucide-vue-next'
import type { IconName } from '@/types'

withDefaults(defineProps<{ name: IconName; strokeWidth?: number }>(), { strokeWidth: 1.75 })
const registry = {
  award: Award,
  'chart-column': ChartColumn,
  compass: Compass,
  crown: Crown,
  'flask-conical': FlaskConical,
  handshake: Handshake,
  infinity: InfinityIcon,
  'message-square': MessageSquare,
  navigation: Navigation,
  newspaper: Newspaper,
  phone: Phone,
  'plane-takeoff': PlaneTakeoff,
  rocket: Rocket,
  shapes: Shapes,
  stamp: Stamp,
  ticket: Ticket,
  'trending-up': TrendingUp,
  video: Video,
  vote: Vote,
  wallet: Wallet,
  zap: Zap,
} as const
</script>
<template>
  <component :is="registry[name]" :stroke-width="strokeWidth" />
</template>