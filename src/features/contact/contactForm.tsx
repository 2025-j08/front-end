'use client';

/**
 * ContactForm コンポーネント
 * お問い合わせフォームのメインページです。
 * FormField、TextAreaField、SubmitButton を組み合わせて
 * ユーザーからのお問い合わせ入力を受け付けます。
 */
import Link from 'next/link';

import { FormField, FormButton, LoadingOverlay, SuccessOverlay } from '@/components/form';

import { useContactForm } from './components/hooks/useContactForm';
import styles from './contactForm.module.scss';

export const ContactForm = () => {
  const { formData, isLoading, isSuccess, handleChange, handleSubmit } = useContactForm();

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <Link href="/">ホーム</Link> &gt; <span>お問い合わせ</span>
      </div>

      <LoadingOverlay isVisible={isLoading} text="送信中..." />
      <SuccessOverlay isVisible={isSuccess} />

      <h1 className={styles.title}>お問い合わせ</h1>

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
          value={formData.name}
          onChange={handleChange}
        />

        <FormField
          label="メールアドレス"
          type="email"
          id="email"
          name="email"
          placeholder="example@email.com"
          required
          value={formData.email}
          onChange={handleChange}
        />

        <FormField
          label="ご用件"
          id="subject"
          name="subject"
          placeholder="お問い合わせ内容の件名"
          required
          value={formData.subject}
          onChange={handleChange}
        />

        <FormField
          label="お問い合わせ内容"
          id="message"
          name="message"
          rows={6}
          placeholder="詳しい内容をご記入ください"
          required
          value={formData.message}
          onChange={handleChange}
          isTextarea
        />

        <FormButton label="送信する" isLoading={isLoading} loadingLabel="送信中..." />
      </form>
    </div>
  );
};
