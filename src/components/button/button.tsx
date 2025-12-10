import React, { MouseEventHandler, ReactNode } from "react";

import styles from './button.module.scss';

export default function Button(props: { children: ReactNode, onClick?: MouseEventHandler, type?: 'button' | 'submit' | 'reset' }) {
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