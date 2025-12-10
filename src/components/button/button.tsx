import { MouseEventHandler } from "react";
import styles from './button.module.scss';

export default function Button(props: { value: string, onClick?: MouseEventHandler }) {

    return (
        <button className={styles.button} onClick={props.onClick}>
            {props.value}
        </button>
    )
}