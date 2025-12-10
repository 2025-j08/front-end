/**
 * ContactForm コンポーネント
 * お問い合わせフォームのメインページです。
 * FormField、TextAreaField、SubmitButton を組み合わせて
 * ユーザーからのお問い合わせ入力を受け付けます。
 */
// お問い合わせページ
import React from 'react';

import FormField from './components/FormField';
import TextAreaField from './components/TextAreaField';
import SubmitButton from './components/SubmitButton';
import './contact.scss';

const ContactForm: React.FC = () => {
  // Prevent default form submission behavior
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: Add form submission logic here (e.g., send data to API)
  };
  return (
    <div className="contact-form-container">
      <h2 className="form-title">お問い合わせ</h2>
      <form className="contact-form" onSubmit={handleSubmit}>
        <FormField label="名前" type="text" id="name" name="name" placeholder="XXXXXXXX......" />
        <FormField label="名前" type="text" id="name" name="name" placeholder="XXXXXXXX......" />

        <FormField
          label="メールアドレス"
          type="email"
          id="email"
          name="email"
          placeholder="XXXXXXXX......"
        />

        <TextAreaField
          label="お問い合わせ内容"
          id="message"
          name="message"
          rows={5}
          placeholder="XXXXXXXX......"
        />

        <SubmitButton label="送信" />
      </form>
    </div>
  );
};

export default ContactForm;
