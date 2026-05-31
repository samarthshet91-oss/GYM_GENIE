export const memory = {
  users: [],
  progress: [],
  dailydiet: []
};

export function publicUser(user) {
  if (!user) return null;
  const { password, ...safe } = user;
  return safe;
}

export function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

