'use client';

/**
 * ContactForm コンポーネント
 * お問い合わせフォームのメインページです。
 * 共通コンポーネントとuseContactFormフックを使用
 */
import { FormField, FormButton, LoadingOverlay, SuccessOverlay } from '@/src/components/form';

import styles from './contactForm.module.scss';
import { useContactForm } from './components/hooks/useContactForm';

const ContactForm = () => {
  const { formData, isLoading, isSuccess, handleChange, handleSubmit } = useContactForm();

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
          label="お電話番号"
          type="tel"
          id="phone"
          name="phone"
          placeholder="090-1234-5678"
          value={formData.phone}
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
          placeholder="詳しい内容をご記入ください"
          required
          isTextarea
          rows={6}
          value={formData.message}
          onChange={handleChange}
        />

        <FormButton label="送信する" loadingLabel="送信中..." isLoading={isLoading} />
      </form>
    </div>
  );
};

export default ContactForm;
