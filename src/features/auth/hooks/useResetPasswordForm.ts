'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

import type { ResetPasswordRequest } from '@/types/api';
import {
  validatePassword,
  validatePasswordMatch,
  PASSWORD_REQUIREMENTS,
  getPasswordRequirementsText,
} from '@/lib/validation';
import { API_ENDPOINTS } from '@/const/api';
import { PASSWORD_RESET_MESSAGES } from '@/const/messages';
import { logError, logInfo } from '@/lib/logger';
import { createClient } from '@/lib/supabase/client';

/**
 * パスワード再設定フォームのデータ型
 */
interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

/**
 * フィールドエラーの型
 */
interface FieldErrors {
  password?: string;
  confirmPassword?: string;
}

/**
 * useResetPasswordForm の戻り値型
 */
interface UseResetPasswordFormReturn {
  /** フォーム入力値の現在の状態 */
  formData: ResetPasswordFormData;
  /** 送信中かどうか */
  isLoading: boolean;
  /** 成功かどうか */
  isSuccess: boolean;
  /** セッション検証中かどうか */
  isCheckingSession: boolean;
  /** 有効なセッションかどうか */
  isValidSession: boolean;
  /** エラーメッセージ */
  errorMessage: string | null;
  /** 各フィールドのエラーメッセージ */
  fieldErrors: FieldErrors;
  /** パスワードの最小文字数 */
  passwordMinLength: number;
  /** パスワード要件の説明テキスト */
  passwordRequirementsText: string;
  /** 入力フィールドの値が変更されたときのハンドラー */
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  /** フォーム送信時のハンドラー */
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
}

/**
 * フォームの初期値
 */
const INITIAL_FORM_DATA: ResetPasswordFormData = {
  password: '',
  confirmPassword: '',
};

/**
 * useResetPasswordForm
 * パスワード再設定フォームの状態管理と送信処理を提供するカスタムフック
 * サーバーサイド（callback/route.ts）でセッションが確立された状態で使用される
 */
export const useResetPasswordForm = (): UseResetPasswordFormReturn => {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [formData, setFormData] = useState<ResetPasswordFormData>(INITIAL_FORM_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  // セッション検証: パスワードリセットフローから来たかどうかを確認
  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error || !user) {
          logError('パスワード再設定: セッションが無効', {
            context: 'useResetPasswordForm',
            error: error?.message,
          });
          if (isMounted) {
            setIsValidSession(false);
            setIsCheckingSession(false);
            // セッションがない場合はログイン画面へリダイレクト
            router.replace('/features/auth?error=invalid_session');
          }
          return;
        }

        logInfo('パスワード再設定: セッション検証成功', {
          context: 'useResetPasswordForm',
          userId: user.id,
        });

        if (isMounted) {
          setIsValidSession(true);
          setIsCheckingSession(false);
        }
      } catch (e) {
        logError('パスワード再設定: セッション検証エラー', {
          context: 'useResetPasswordForm',
          error: e instanceof Error ? e.message : String(e),
        });
        if (isMounted) {
          setIsValidSession(false);
          setIsCheckingSession(false);
          router.replace('/features/auth?error=invalid_session');
        }
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, [supabase, router]);

  // 最新のformDataを参照するためのref
  const formDataRef = useRef(formData);
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  /**
   * 入力値変更ハンドラ
   */
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // パスワードフィールドの場合、リアルタイムバリデーション
    if (name === 'password') {
      const validation = validatePassword(value);
      const confirmPasswordValue = formDataRef.current.confirmPassword;
      const matchValidation = validatePasswordMatch(value, confirmPasswordValue);
      const confirmError =
        confirmPasswordValue && !matchValidation.isValid ? matchValidation.error : undefined;

      setFieldErrors((prev) => ({
        ...prev,
        password: validation.isValid ? undefined : validation.errors[0],
        confirmPassword: confirmError,
      }));
    }

    // パスワード確認フィールドの場合、一致チェック
    if (name === 'confirmPassword') {
      const matchValidation = validatePasswordMatch(formDataRef.current.password, value);
      setFieldErrors((prev) => ({
        ...prev,
        confirmPassword: matchValidation.isValid ? undefined : matchValidation.error,
      }));
    }

    // 入力時に全体エラーをクリア
    setErrorMessage(null);
  }, []);

  /**
   * フォーム送信ハンドラ
   */
  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const newFieldErrors: FieldErrors = {};
      let hasError = false;

      // パスワードのバリデーション
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newFieldErrors.password = passwordValidation.errors.join('、');
        hasError = true;
      }

      // パスワード確認の一致チェック
      const passwordMatchValidation = validatePasswordMatch(
        formData.password,
        formData.confirmPassword,
      );
      if (!passwordMatchValidation.isValid) {
        newFieldErrors.confirmPassword = passwordMatchValidation.error;
        hasError = true;
      }

      if (hasError) {
        setFieldErrors((prev) => ({ ...prev, ...newFieldErrors }));
        setErrorMessage('入力内容を確認してください');
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);

      try {
        const payload: ResetPasswordRequest = {
          password: formData.password,
        };

        const response = await fetch(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const responseBody = await response.json().catch(() => null);

        if (!response.ok || !responseBody?.success) {
          const apiError = responseBody?.error ?? PASSWORD_RESET_MESSAGES.RESET_FAILED;
          throw new Error(apiError);
        }

        // 成功
        setIsSuccess(true);

        // 成功オーバーレイ表示後、サインアウトしてログイン画面へ遷移
        // パスワード再設定のためにセッションが確立されているが、
        // ユーザーには新しいパスワードでログインし直してもらう
        setTimeout(async () => {
          try {
            await supabase.auth.signOut();
            logInfo('パスワード再設定後のサインアウト完了', {
              context: 'useResetPasswordForm',
            });
          } catch (e) {
            logError('パスワード再設定後のサインアウトエラー', {
              context: 'useResetPasswordForm',
              error: e instanceof Error ? e.message : String(e),
            });
          }
          router.push('/features/auth');
        }, 2000);
      } catch (error) {
        logError('パスワード再設定エラー', {
          component: 'useResetPasswordForm',
          action: 'handleSubmit',
          error: error instanceof Error ? error : String(error),
        });
        setErrorMessage(
          error instanceof Error ? error.message : PASSWORD_RESET_MESSAGES.RESET_FAILED,
        );
      } finally {
        setIsLoading(false);
      }
    },
    [formData, router, supabase],
  );

  return {
    formData,
    isLoading,
    isSuccess,
    isCheckingSession,
    isValidSession,
    errorMessage,
    fieldErrors,
    passwordMinLength: PASSWORD_REQUIREMENTS.MIN_LENGTH,
    passwordRequirementsText: getPasswordRequirementsText(),
    handleChange,
    handleSubmit,
  };
};
