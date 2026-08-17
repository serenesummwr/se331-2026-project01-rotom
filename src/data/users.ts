import type { LevelId, Role, User } from '@/types'

// The member directory.

type Row = [
  id: number,
  username: string,
  firstName: string,
  lastName: string,
  province: string,
  level: LevelId,
  active: boolean,
  joinedAt: string,
  bio: string,
]
const rows: Row[] = [
  [1, 'admin', 'Kanya', 'Rattanakosin', 'Bangkok', 4, true, '2024-01-08', 'Passport administrator. Keeps the levels, the exams and the member directory in order.'],
  [2, 'user1', 'Tanawat', 'Srisuk', 'Chiang Mai', 1, true, '2026-06-02', 'Just opened the passport and working through the Level 1 track.'],
  [3, 'user2', 'Ploy', 'Wattanakul', 'Bangkok', 2, true, '2026-03-14', 'Level 2 since March. Mostly here for the shared workspaces.'],
  [4, 'nira.k', 'Nira', 'Kittipong', 'Phuket', 3, true, '2025-11-21', 'Runs a small dive shop and automates the bookings with Service.'],
  [5, 'somchai.p', 'Somchai', 'Prasert', 'Khon Kaen', 2, true, '2025-09-05', 'Agricultural co-op coordinator.'],
  [6, 'malee.j', 'Malee', 'Jantana', 'Chiang Rai', 1, true, '2026-07-19', 'New member, still on the first eLearning video.'],
  [7, 'apinya.s', 'Apinya', 'Sombat', 'Songkhla', 4, true, '2024-05-30', 'Level 4 and a regular at the product council.'],
  [8, 'krit.t', 'Krit', 'Thongchai', 'Chonburi', 3, false, '2025-02-11', 'Account suspended pending a quota review.'],
  [9, 'siriporn.w', 'Siriporn', 'Wongwan', 'Lampang', 2, true, '2025-12-02', 'Teaches the Service basics at the local community centre.'],
  [10, 'daran.b', 'Daran', 'Boonmee', 'Nakhon Ratchasima', 1, true, '2026-08-01', 'Signed up last week.'],
  [11, 'ratana.c', 'Ratana', 'Chaiyaporn', 'Phra Nakhon Si Ayutthaya', 3, true, '2025-04-17', 'Heritage tour operator, heavy analytics user.'],
  [12, 'wichai.n', 'Wichai', 'Nakarin', 'Bangkok', 2, true, '2025-10-09', 'Logistics planner.'],
  [13, 'pimchanok.l', 'Pimchanok', 'Laohakul', 'Chiang Mai', 4, true, '2024-08-23', 'Was in the very first Level 4 cohort.'],
  [14, 'anon.r', 'Anon', 'Ruangdet', 'Phuket', 1, false, '2026-05-06', 'Deactivated after repeated failed exam attempts from a shared account.'],
  [15, 'kanokwan.s', 'Kanokwan', 'Suwannee', 'Khon Kaen', 3, true, '2025-06-28', 'Data analyst at a rice exporter.'],
  [16, 'thiti.m', 'Thiti', 'Maneerat', 'Chonburi', 2, true, '2026-01-15', 'Runs the weekend maker market.'],
  [17, 'jira.p', 'Jira', 'Pongsakorn', 'Songkhla', 1, true, '2026-07-03', 'Fisheries student.'],
  [18, 'benja.k', 'Benja', 'Kraisorn', 'Lampang', 4, true, '2024-11-11', 'Ceramics studio owner. Uses the concierge desk constantly.'],
  [19, 'natcha.v', 'Natcha', 'Voravit', 'Bangkok', 3, true, '2025-03-08', 'Product designer.'],
  [20, 'ekkarat.d', 'Ekkarat', 'Damrongchai', 'Chiang Rai', 2, true, '2025-08-14', 'Coffee cooperative, exports to three countries.'],
  [21, 'sunisa.t', 'Sunisa', 'Trakulwit', 'Nakhon Ratchasima', 1, true, '2026-06-25', 'Started the Level 1 track in June.'],
  [22, 'phong.a', 'Phong', 'Aroonrat', 'Phra Nakhon Si Ayutthaya', 3, false, '2025-01-29', 'Deactivated at the member request while travelling.'],
  [23, 'chalida.n', 'Chalida', 'Nopparat', 'Chiang Mai', 2, true, '2025-11-04', 'Runs a guesthouse near the old city.'],
  [24, 'veera.s', 'Veera', 'Sakdiyakorn', 'Phuket', 4, true, '2024-03-19', 'Marine logistics. One of the heaviest Service users on the platform.'],
  [25, 'orn.k', 'Ornanong', 'Kesorn', 'Khon Kaen', 1, true, '2026-07-28', 'Joined after a workshop.'],
  [26, 'panu.w', 'Panu', 'Wisetsiri', 'Songkhla', 2, true, '2026-02-06', 'Runs the rubber trader association portal.'],
  [27, 'arisa.m', 'Arisa', 'Meechai', 'Bangkok', 3, true, '2025-05-22', 'Fintech compliance officer.'],
  [28, 'kittipong.r', 'Kittipong', 'Rojjanaporn', 'Chonburi', 1, true, '2026-08-09', 'The newest member in the directory.'],
  [29, 'suda.c', 'Suda', 'Chaimongkol', 'Lampang', 4, true, '2024-09-27', 'Textile exporter, on the product council since 2025.'],
  [30, 'nopporn.t', 'Nopporn', 'Techasarin', 'Chiang Rai', 2, true, '2025-07-12', 'Highland farming project lead.'],
  [31, 'wanida.p', 'Wanida', 'Puangsri', 'Nakhon Ratchasima', 3, true, '2025-09-30', 'Regional hospital systems coordinator.'],
  [32, 'sarawut.k', 'Sarawut', 'Kanjanapak', 'Phra Nakhon Si Ayutthaya', 1, false, '2026-04-02', 'Deactivated after a billing dispute.'],
  [33, 'preeda.h', 'Preeda', 'Hemchai', 'Phuket', 2, true, '2026-01-23', 'Boat charter operator.'],
  [34, 'yupin.s', 'Yupin', 'Saetang', 'Bangkok', 3, true, '2025-10-27', 'Runs the volunteer network in Bang Rak.'],
]
function toUser([id, username, firstName, lastName, province, level, active, joinedAt, bio]: Row): User {
  return {
    id,
    username,
    role: username === 'admin' ? ('admin' as Role) : ('user' as Role),
    firstName,
    lastName,
    province,
    email: `${username.replace(/\./g, '')}@catpassport.dev`,
    phone: `08${id % 10} ${String(100 + id * 7).slice(0, 3)} ${String(1000 + id * 13).slice(0, 4)}`,
    avatar: `https://api.dicebear.com/9.x/notionists/svg?seed=${username}&backgroundColor=1f2540,2a3150,343b58`,
    level,
    active,
    joinedAt: `${joinedAt}T09:00:00.000Z`,
    bio,
  }
}
export const users: User[] = rows.map(toUser)