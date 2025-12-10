import React, { MouseEventHandler, ReactNode } from "react";

import styles from './button.module.scss';

export default function Button(props: { children: ReactNode, onClick?: MouseEventHandler }) {
    return (
        <button className={styles.button} onClick={props.onClick}>
            {props.children}
        </button>
    )
}