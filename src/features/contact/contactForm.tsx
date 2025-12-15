'use client';

import { useState } from 'react';

/**
 * ContactForm コンポーネント
 * お問い合わせフォームのメインページです。
 * 共通コンポーネントを使用したリファクタリング版
 */
import styles from './contactForm.module.scss';

import { FormField, FormButton, LoadingOverlay, SuccessOverlay } from '@/src/components/form';

const ContactForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    // デモ用：2秒後にローディング終了
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log('Contact form submitted');
    setIsLoading(false);
    setIsSuccess(true);

    // 3秒後に成功メッセージをリセット
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <div className={styles['contact-form-container']}>
      <LoadingOverlay isVisible={isLoading} text="送信中..." />
      <SuccessOverlay isVisible={isSuccess} text="送信が完了しました" />

      <h2 className={styles['form-title']}>お問い合わせ</h2>
      <p className={styles['form-description']}>
        ご質問・ご相談がございましたら、以下のフォームよりお気軽にお問い合わせください。
      </p>

      <form onSubmit={handleSubmit}>
        <FormField
          label="お名前"
          type="text"
          id="name"
          name="name"
          placeholder="山田 太郎"
          required
        />

        <FormField
          label="メールアドレス"
          type="email"
          id="email"
          name="email"
          placeholder="example@email.com"
          required
        />

        <FormField
          label="お電話番号"
          type="tel"
          id="phone"
          name="phone"
          placeholder="090-1234-5678"
        />

        <FormField
          label="ご用件"
          id="subject"
          name="subject"
          placeholder="お問い合わせ内容の件名"
          required
        />

        <FormField
          label="お問い合わせ内容"
          id="message"
          name="message"
          placeholder="詳しい内容をご記入ください"
          required
          isTextarea
          rows={6}
        />

        <FormButton label="送信する" loadingLabel="送信中..." isLoading={isLoading} />
      </form>
    </div>
  );
};

export default ContactForm;
