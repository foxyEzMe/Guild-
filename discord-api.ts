import { apiRequest } from './queryClient';
import type { DiscordMember, Announcement, ServerStats } from '@shared/schema';

export async function fetchDiscordMembers(): Promise<DiscordMember[]> {
  const response = await apiRequest('GET', '/api/discord/members');
  return response.json();
}

export async function fetchDiscordAnnouncements(limit: number = 3): Promise<Announcement[]> {
  const response = await apiRequest('GET', `/api/discord/announcements?limit=${limit}`);
  return response.json();
}

export async function fetchServerStats(): Promise<ServerStats> {
  const response = await apiRequest('GET', '/api/discord/stats');
  return response.json();
}

export async function loginUser(username: string, password: string): Promise<{ message: string; user: { id: number; username: string } }> {
  const response = await apiRequest('POST', '/api/auth/login', { username, password });
  return response.json();
}
