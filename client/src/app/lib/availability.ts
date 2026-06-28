export interface AvailableProfessional {
  id: string;
  profession: string;
  region: string;
  experience: number;
  timestamp: number;
  userEmail?: string;
}

const KEY = "zp_availability_v2";
const TTL = 24 * 60 * 60 * 1000;

function getFreshSeeds(): AvailableProfessional[] {
  return [
    { id: "s1", profession: "Jeugdzorgwerker", region: "Limburg", experience: 8, timestamp: Date.now() - 7_200_000 },
    { id: "s2", profession: "Ondersteuner", region: "Eindhoven", experience: 5, timestamp: Date.now() - 14_400_000 },
    { id: "s3", profession: "MZV Professional", region: "Venray", experience: 10, timestamp: Date.now() - 3_600_000 },
    { id: "s4", profession: "Verpleegkundige", region: "Amsterdam", experience: 12, timestamp: Date.now() - 21_600_000 },
    { id: "s5", profession: "Begeleider", region: "Utrecht", experience: 3, timestamp: Date.now() - 10_800_000 },
    { id: "s6", profession: "Verzorgende IG", region: "Rotterdam", experience: 7, timestamp: Date.now() - 18_000_000 },
  ];
}

function load(): AvailableProfessional[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const fresh = getFreshSeeds();
      localStorage.setItem(KEY, JSON.stringify(fresh));
      return fresh;
    }
    const all: AvailableProfessional[] = JSON.parse(raw);
    const active = all.filter(p => Date.now() - p.timestamp < TTL);
    if (active.length === 0) {
      const fresh = getFreshSeeds();
      localStorage.setItem(KEY, JSON.stringify(fresh));
      return fresh;
    }
    return active;
  } catch {
    return getFreshSeeds();
  }
}

function persist(data: AvailableProfessional[]): void {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
}

export function getAvailable(): AvailableProfessional[] {
  const active = load();
  persist(active);
  return active;
}

export function addAvailable(data: Omit<AvailableProfessional, "id" | "timestamp">): AvailableProfessional {
  const all = load();
  const entry: AvailableProfessional = { ...data, id: `u-${Date.now()}`, timestamp: Date.now() };
  persist([...all, entry]);
  return entry;
}

export function removeAvailable(id: string): void {
  persist(load().filter(p => p.id !== id));
}

export function getByEmail(email: string): AvailableProfessional | undefined {
  return load().find(p => p.userEmail === email);
}

export function timeRemaining(timestamp: number): string {
  const rem = TTL - (Date.now() - timestamp);
  if (rem <= 0) return "Verlopen";
  const h = Math.floor(rem / 3_600_000);
  const m = Math.floor((rem % 3_600_000) / 60_000);
  return h > 0 ? `${h}u ${m}m resterend` : `${m}m resterend`;
}
