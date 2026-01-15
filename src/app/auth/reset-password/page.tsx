import { ResetPasswordForm } from '@/features/auth/resetPasswordForm';

/**
 * パスワード再設定ページ
 * サーバーサイド（callback/route.ts）でセッションが確立された状態でアクセスされる
 */
export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
