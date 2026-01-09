import styles from './TabContent.module.scss';

type SelectOption = {
  value: string;
  label: string;
};

type BaseFieldProps = {
  /** フィールドのID（HTMLのid属性） */
  id: string;
  /** ラベルテキスト */
  label: string;
  /** 値変更時のハンドラー */
  onChange: (value: unknown) => void;
  /** 無効化フラグ */
  disabled?: boolean;
};

type TextFieldProps = BaseFieldProps & {
  type: 'text';
  value: string | undefined;
  placeholder?: string;
};

type NumberFieldProps = BaseFieldProps & {
  type: 'number';
  value: number | string | undefined;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number | string;
};

type TextareaFieldProps = BaseFieldProps & {
  type: 'textarea';
  value: string | undefined;
  placeholder?: string;
  rows?: number;
};

type SelectFieldProps = BaseFieldProps & {
  type: 'select';
  value: string | undefined;
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
  const { type, id, label, onChange, disabled } = props;

  const renderInput = () => {
    switch (type) {
      case 'text':
        return (
          <input
            type="text"
            id={id}
            className={styles.editInput}
            value={props.value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={props.placeholder}
            disabled={disabled}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            id={id}
            className={styles.editInput}
            value={props.value ?? ''}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
            placeholder={props.placeholder}
            min={props.min}
            max={props.max}
            step={props.step}
            disabled={disabled}
          />
        );

      case 'textarea':
        return (
          <textarea
            id={id}
            className={styles.editTextarea}
            value={props.value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={props.placeholder}
            rows={props.rows ?? 3}
            disabled={disabled}
          />
        );

      case 'select':
        return (
          <select
            id={id}
            className={styles.editInput}
            value={props.value ?? ''}
            onChange={(e) => onChange(e.target.value || undefined)}
            disabled={disabled}
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
    </div>
  );
};
