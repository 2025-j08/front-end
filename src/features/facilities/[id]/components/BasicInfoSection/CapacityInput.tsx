import styles from './BasicInfoSection.module.scss';

/** 定員入力フィールドのコンポーネント */
type CapacityInputProps = {
  capacity?: number;
  provisionalCapacity?: number;
  onFieldChange?: (field: string, value: unknown) => void;
  getError?: (field: string) => string | undefined;
};

/** 数値入力フィールド（内部コンポーネント） */
type NumberInputFieldProps = {
  id: string;
  label: string;
  value: number | undefined;
  placeholder: string;
  error?: string;
  onChange: (value: string) => void;
};

const NumberInputField = ({
  id,
  label,
  value,
  placeholder,
  error,
  onChange,
}: NumberInputFieldProps) => (
  <div className={styles.capacityField}>
    <label htmlFor={id} className={styles.subLabel}>
      {label}
    </label>
    <input
      type="number"
      id={id}
      className={`${styles.editInput} ${error ? styles.errorInput : ''}`}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      min={0}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
    />
    {error && (
      <span id={`${id}-error`} className={styles.errorText} role="alert">
        {error}
      </span>
    )}
  </div>
);

export const CapacityInput = ({
  capacity,
  provisionalCapacity,
  onFieldChange,
  getError = () => undefined,
}: CapacityInputProps) => {
  // 数値フィールド変更のヘルパー関数
  const handleNumberChange = (field: string, value: string) => {
    onFieldChange?.(field, value ? Number(value) : undefined);
  };

  return (
    <div className={styles.infoCard}>
      <label className={styles.label} htmlFor="capacity">
        施設定員
      </label>
      <div className={styles.capacityInputs}>
        <NumberInputField
          id="capacity"
          label="定員"
          value={capacity}
          placeholder="定員"
          onChange={(v) => handleNumberChange('capacity', v)}
          error={getError('capacity')}
        />
        <NumberInputField
          id="provisionalCapacity"
          label="暫定定員"
          value={provisionalCapacity}
          placeholder="暫定定員"
          onChange={(v) => handleNumberChange('provisionalCapacity', v)}
          error={getError('provisionalCapacity')}
        />
      </div>
    </div>
  );
};
