import React from "react";
import { useRef, useEffect } from "react";
import { nanoid } from 'nanoid';
import styles from '../styles/Messages.module.css'
import {normalizeMessage} from '../utils';

const Messages = ({messages, name}) => {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({behavior: 'smooth'});
      }, [messages]);

    return (
        <div className={styles.messages}>
            {messages.map(({message, user}) => {
                const isItMe = normalizeMessage(user.name) === normalizeMessage(name);
                const className = isItMe ? styles.me : styles.user;

                return (
                    <div key={nanoid()} className={`${styles.message} ${className}`}>
                        <span className={styles.user}>{user.name}</span>
                        <div className={styles.text}>{message}</div>
                    </div>
                )
            })}
            <div ref={bottomRef} />
        </div>
    )
}

export default Messages;