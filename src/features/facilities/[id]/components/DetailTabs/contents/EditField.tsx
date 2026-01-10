import styles from './TabContent.module.scss';

const DEFAULT_TEXTAREA_ROWS = 3;

type SelectOption = {
  value: string;
  label: string;
};

type BaseFieldProps = {
  /** フィールドのID（HTMLのid属性） */
  id: string;
  /** ラベルテキスト */
  label: string;
  /** 無効化フラグ */
  disabled?: boolean;
  /** バリデーションエラーメッセージ */
  error?: string;
};

type TextFieldProps = BaseFieldProps & {
  type: 'text';
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
};

type NumberFieldProps = BaseFieldProps & {
  type: 'number';
  value: number | undefined; // Removed string allowing strictly number or undefined
  onChange: (value: number | undefined) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number | string;
};

type TextareaFieldProps = BaseFieldProps & {
  type: 'textarea';
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
};

type SelectFieldProps = BaseFieldProps & {
  type: 'select';
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  options: SelectOption[];
};

export type EditFieldProps =
  | TextFieldProps
  | NumberFieldProps
  | TextareaFieldProps
  | SelectFieldProps;

/**
 * 編集モード用の汎用入力フィールドコンポーネント
 * text, number, textarea, select の4タイプに対応
 *
 * @example
 * <EditField
 *   type="text"
 *   id="staffCount"
 *   label="職員数"
 *   value={staffInfo.staffCount}
 *   onChange={(v) => onFieldChange?.('staffCount', v)}
 *   placeholder="例: 常勤16名"
 * />
 */
export const EditField = (props: EditFieldProps) => {
  const { id, label, disabled } = props;

  const renderInput = () => {
    switch (props.type) {
      case 'text':
        return (
          <input
            type="text"
            id={id}
            className={`${styles.editInput} ${props.error ? styles.errorInput : ''}`}
            value={props.value || ''}
            onChange={(e) => props.onChange(e.target.value)}
            placeholder={props.placeholder}
            disabled={disabled}
            aria-invalid={!!props.error}
            aria-describedby={props.error ? `${id}-error` : undefined}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            id={id}
            className={`${styles.editInput} ${props.error ? styles.errorInput : ''}`}
            value={props.value ?? ''}
            onChange={(e) => props.onChange(e.target.value ? Number(e.target.value) : undefined)}
            placeholder={props.placeholder}
            min={props.min}
            max={props.max}
            step={props.step}
            disabled={disabled}
            aria-invalid={!!props.error}
            aria-describedby={props.error ? `${id}-error` : undefined}
          />
        );

      case 'textarea':
        return (
          <textarea
            id={id}
            className={`${styles.editTextarea} ${props.error ? styles.errorInput : ''}`}
            value={props.value || ''}
            onChange={(e) => props.onChange(e.target.value)}
            placeholder={props.placeholder}
            rows={props.rows ?? DEFAULT_TEXTAREA_ROWS}
            disabled={disabled}
            aria-invalid={!!props.error}
            aria-describedby={props.error ? `${id}-error` : undefined}
          />
        );

      case 'select':
        return (
          <select
            id={id}
            className={`${styles.editInput} ${props.error ? styles.errorInput : ''}`}
            value={props.value ?? ''}
            onChange={(e) => props.onChange(e.target.value || undefined)}
            disabled={disabled}
            aria-invalid={!!props.error}
            aria-describedby={props.error ? `${id}-error` : undefined}
          >
            {props.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );
    }
  };

  return (
    <div className={styles.editGroup}>
      <label htmlFor={id} className={styles.editLabel}>
        {label}
      </label>
      {renderInput()}
      {props.error && (
        <span id={`${id}-error`} className={styles.errorText} role="alert">
          {props.error}
        </span>
      )}
    </div>
  );
};
