'use client';

/**
 * ContactForm コンポーネント
 * お問い合わせフォームのメインページです。
 * FormField、TextAreaField、SubmitButton を組み合わせて
 * ユーザーからのお問い合わせ入力を受け付けます。
 */
import React from 'react';

import { FormField } from './components/formField/formField';
import { TextAreaField } from './components/textArea/textAreaField';
import { SubmitButton } from './components/button/submitButton';
import { useContactForm } from './components/hooks/useContactForm';
import './contact.scss';

const ContactForm = () => {
  const { formData, handleChange, handleSubmit } = useContactForm();

  return (
    <div className="contact-form-container">
      <h2 className="form-title">お問い合わせ</h2>
      <form className="contact-form" onSubmit={handleSubmit}>
        <FormField
          label="名前"
          type="text"
          id="name"
          name="name"
          placeholder="山田太郎"
          maxLength={20}
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
          pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
          required
          value={formData.email}
          onChange={handleChange}
        />

        <TextAreaField
          label="お問い合わせ内容"
          id="message"
          name="message"
          rows={5}
          placeholder="お問い合わせ内容を入力してください"
          minLength={10}
          maxLength={1000}
          required
          value={formData.message}
          onChange={handleChange}
        />

        <SubmitButton label="送信" />
      </form>
    </div>
  );
};

export { ContactForm };
