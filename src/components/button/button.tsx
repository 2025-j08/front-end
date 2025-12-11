import React, { MouseEventHandler, ReactNode } from "react";

import styles from './button.module.scss';

type ButtonProps = {
    children: ReactNode,
    onClick?: MouseEventHandler,
    type?: 'button' | 'submit' | 'reset'
};

export const Button = (props: ButtonProps) => {
    return (
        <button
            className={styles.button}
            onClick={props.onClick}
            type={props.type ?? 'button'}
        >
            {props.children}
        </button>
    )
}