/**
 * /features/auth ルート
 * ログインフォームを表示
 * 招待認証エラーのハンドリングを行う
 */
import { LoginForm } from '@/features/auth/loginForm';
import { INVITATION_ERROR_MESSAGES, type InvitationErrorCode } from '@/const/messages';

type PageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function FeaturesAuthPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const errorCode = params.error;

  // 招待認証エラーのメッセージを取得
  let invitationError: string | undefined;
  if (errorCode && errorCode in INVITATION_ERROR_MESSAGES) {
    invitationError = INVITATION_ERROR_MESSAGES[errorCode as InvitationErrorCode];
  }

  return <LoginForm initialError={invitationError} />;
}
