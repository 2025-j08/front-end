import { MouseEventHandler, ReactNode } from 'react';

import styles from './button.module.scss';

/**
 * Buttonコンポーネント のProps
 */
export interface ButtonProps {
  children: ReactNode;
  onClick?: MouseEventHandler;
  type?: 'button' | 'submit' | 'reset';
}

export const Button = (props: ButtonProps) => {
  return (
    <button className={styles.button} onClick={props.onClick} type={props.type ?? 'button'}>
      {props.children}
    </button>
  );
};
