import type { Component } from 'vue'
export type LevelId = 1 | 2 | 3 | 4
export type Role = 'admin' | 'user'
export interface User {
  id: number
  username: string
  role: Role
  firstName: string
  lastName: string
  email: string
  phone: string
  province: string
  avatar: string
  level: LevelId
  active: boolean
  joinedAt: string
  bio: string
}

export type IconName =
  | 'award'
  | 'chart-column'
  | 'compass'
  | 'crown'
  | 'flask-conical'
  | 'handshake'
  | 'infinity'
  | 'message-square'
  | 'navigation'
  | 'newspaper'
  | 'phone'
  | 'plane-takeoff'
  | 'rocket'
  | 'shapes'
  | 'stamp'
  | 'ticket'
  | 'trending-up'
  | 'video'
  | 'vote'
  | 'wallet'
  | 'zap'

export interface Benefit {
  id: number
  levelId: LevelId
  title: string
  description: string
  icon: IconName
}

export interface Service {
  id: number
  levelId: LevelId
  name: string
  description: string
  category: string
}
export interface Level {
  id: LevelId
  name: string
  tagline: string
  description: string
  passCriteria: number
  accent: string
}
export interface Badge {
  id: number
  levelId: LevelId
  name: string
  description: string
  icon: IconName
}

export type UserEditable = Pick<
  User,
  'firstName' | 'lastName' | 'email' | 'phone' | 'province' | 'bio'
>

export type UserRegistration = Pick<User, 'username'> & UserEditable
export interface NavItem {
  label: string
  icon: Component
  to: { name: string }
    exact?: boolean
}
export interface ProfileLink {
  label: string
  to: { name: string }
}
export interface UserFilterState {
  name: string
  level: LevelId | 'all'
  province: string | 'all'
}