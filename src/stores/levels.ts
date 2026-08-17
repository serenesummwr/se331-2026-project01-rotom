import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  badges,
  benefits as seedBenefits,
  levels as seedLevels,
  services as seedServices,
} from '@/data/levels'
import type { Badge, Benefit, Level, LevelId, Service } from '@/types'

export const useLevelStore = defineStore('levels', () => {
  const levels = ref<Level[]>([...seedLevels])
  const benefits = ref<Benefit[]>([...seedBenefits])
  const services = ref<Service[]>([...seedServices])
  const levelBadges = ref<Badge[]>([...badges])
  const levelById = computed(() => (id: LevelId) => levels.value.find((level) => level.id === id))
  const levelName = computed(() => (id: LevelId) => levelById.value(id)?.name ?? `Level ${id}`)
  const benefitsFor = computed(
    () => (id: LevelId) => benefits.value.filter((benefit) => benefit.levelId === id),
  )
  const servicesFor = computed(
    () => (id: LevelId) => services.value.filter((service) => service.levelId === id),
  )
  const badgesUpTo = computed(
    () => (id: LevelId) => levelBadges.value.filter((badge) => badge.levelId <= id),
  )
  const nextLevel = computed(
    () => (id: LevelId) => (id < 4 ? (levelById.value((id + 1) as LevelId) ?? null) : null),
  )
  const passCriteriaFor = computed(() => (id: LevelId) => levelById.value(id)?.passCriteria ?? 60)

  function updateLevel(id: LevelId, patch: Partial<Omit<Level, 'id'>>) {
    const index = levels.value.findIndex((level) => level.id === id)
    if (index === -1) return
    levels.value[index] = { ...levels.value[index]!, ...patch }
  }
  return {
    levels,
    benefits,
    services,
    levelBadges,
    levelById,
    levelName,
    benefitsFor,
    servicesFor,
    badgesUpTo,
    nextLevel,
    passCriteriaFor,
    updateLevel,
  }
})
