import { useState } from 'react';

interface UserIssuanceFormData {
  email: string;
  facilityId: string;
}

export const useUserIssuanceForm = () => {
  const [formData, setFormData] = useState<UserIssuanceFormData>({
    email: '',
    facilityId: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  /**
   * 入力変更時のハンドラー
   * FormField(input/textarea) と select の両方に対応するため、
   * HTMLTextAreaElement を追加して FormField の要求を満たします。
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    // API送信のシミュレーション
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return {
    formData,
    isLoading,
    isSuccess,
    handleChange,
    handleSubmit,
  };
};
