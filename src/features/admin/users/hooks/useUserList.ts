import { useState, useEffect, useCallback } from 'react';

import type { User, UserOperationResponse } from '@/types/api';
import { API_ENDPOINTS } from '@/const/api';
import { USER_MANAGEMENT_MESSAGES } from '@/const/messages';
import { logError } from '@/lib/clientLogger';

/**
 * API成功レスポンスの型
 */
interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  error?: never;
}

/**
 * APIエラーレスポンスの型
 */
interface ApiErrorResponse {
  success: false;
  error: string;
  data?: never;
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

interface UseUserListReturn {
  users: User[];
  isLoading: boolean;
  error: string | null;
  deleteUser: (id: string) => Promise<boolean>;
  updateUser: (id: string, name: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

/**
 * ユーザー一覧のデータ取得・操作を管理するカスタムフック
 */
export function useUserList(): UseUserListReturn {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * ユーザー一覧を取得
   */
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(API_ENDPOINTS.ADMIN.USERS, {
        method: 'GET',
        credentials: 'include',
      });

      const data: ApiResponse<User[]> = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error ?? USER_MANAGEMENT_MESSAGES.FETCH_FAILED);
      }

      setUsers(data.data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : USER_MANAGEMENT_MESSAGES.FETCH_FAILED;
      setError(errorMessage);
      logError('ユーザー一覧の取得に失敗しました', {
        component: 'useUserList',
        error: err instanceof Error ? err : String(err),
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * ユーザーを削除
   * @returns 成功した場合はtrue
   */
  const deleteUser = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_ENDPOINTS.ADMIN.USERS}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data: UserOperationResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error ?? USER_MANAGEMENT_MESSAGES.DELETE_FAILED);
      }

      // ローカルの一覧から削除
      setUsers((prev) => prev.filter((user) => user.id !== id));
      return true;
    } catch (err) {
      logError('ユーザーの削除に失敗しました', {
        component: 'useUserList',
        userId: id,
        error: err instanceof Error ? err : String(err),
      });
      return false;
    }
  }, []);

  /**
   * ユーザー情報を更新（氏名のみ）
   * @returns 成功した場合はtrue
   */
  const updateUser = useCallback(async (id: string, name: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_ENDPOINTS.ADMIN.USERS}/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      const data: UserOperationResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error ?? USER_MANAGEMENT_MESSAGES.UPDATE_FAILED);
      }

      // ローカルの一覧を更新
      setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, name } : user)));
      return true;
    } catch (err) {
      logError('ユーザー情報の更新に失敗しました', {
        component: 'useUserList',
        userId: id,
        error: err instanceof Error ? err : String(err),
      });
      return false;
    }
  }, []);

  // 初回マウント時にデータ取得
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    isLoading,
    error,
    deleteUser,
    updateUser,
    refetch: fetchUsers,
  };
}
