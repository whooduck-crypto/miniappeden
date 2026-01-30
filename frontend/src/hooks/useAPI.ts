import { useState, useCallback } from 'react';
import { userAPI, shopAPI, tournamentAPI, ratingAPI, achievementAPI } from '../services/api';

/**
 * Хук для загрузки профиля пользователя
 */
export function useUserProfile(userId: number | null) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await userAPI.getProfile(userId);
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return { profile, loading, error, fetchProfile };
}

/**
 * Хук для работы с магазином
 */
export function useShop(userId: number | null) {
  const [items, setItems] = useState<any[]>([]);
  const [userItems, setUserItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await shopAPI.getItems();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load items');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserItems = useCallback(async () => {
    if (!userId) return;
    
    try {
      const data = await shopAPI.getUserItems(userId);
      setUserItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user items');
    }
  }, [userId]);

  const purchase = useCallback(async (itemId: number) => {
    if (!userId) return;
    
    try {
      const result = await shopAPI.purchase(userId, itemId);
      await fetchUserItems();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Purchase failed');
      throw err;
    }
  }, [userId, fetchUserItems]);

  return { items, userItems, loading, error, fetchItems, fetchUserItems, purchase };
}

/**
 * Хук для работы с турнирами
 */
export function useTournaments() {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTournaments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tournamentAPI.getTournaments();
      setTournaments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tournaments');
    } finally {
      setLoading(false);
    }
  }, []);

  const joinTournament = useCallback(async (userId: number, tournamentId: number) => {
    try {
      const result = await tournamentAPI.joinTournament(userId, tournamentId);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join tournament');
      throw err;
    }
  }, []);

  return { tournaments, loading, error, fetchTournaments, joinTournament };
}

/**
 * Хук для работы с рейтингом
 */
export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async (limit: number = 100) => {
    setLoading(true);
    setError(null);
    try {
      const data = await ratingAPI.getLeaderboard(limit);
      setLeaderboard(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  }, []);

  return { leaderboard, loading, error, fetchLeaderboard };
}

/**
 * Хук для работы с достижениями
 */
export function useAchievements(userId: number | null) {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [userAchievements, setUserAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAchievements = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await achievementAPI.getAchievements();
      setAchievements(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load achievements');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserAchievements = useCallback(async () => {
    if (!userId) return;
    
    try {
      const data = await achievementAPI.getUserAchievements(userId);
      setUserAchievements(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user achievements');
    }
  }, [userId]);

  return { achievements, userAchievements, loading, error, fetchAchievements, fetchUserAchievements };
}
