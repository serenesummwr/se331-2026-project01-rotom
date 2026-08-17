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

export type UserEditable = Pick<
  User,
  'firstName' | 'lastName' | 'email' | 'phone' | 'province' | 'bio'
>

export type UserRegistration = Pick<User, 'username'> & UserEditable
export interface UserFilterState {
  name: string
  level: LevelId | 'all'
  province: string | 'all'
}