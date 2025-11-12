export type Staff = { id: string; name: string; role?: string; rating?: number };

export const STAFF: Staff[] = [
  { id: "st-alex", name: "Алексей В.", role: "Парикмахер", rating: 4.8 },
  { id: "st-olga", name: "Ольга К.", role: "Колорист", rating: 4.9 },
  { id: "st-daria", name: "Дарья Л.", role: "Нейл-мастер", rating: 4.7 },
];