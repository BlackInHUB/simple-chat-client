import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import {useLocation, useNavigate} from 'react-router-dom';
import io from 'socket.io-client';
import EmojiPicker from 'emoji-picker-react'

import icon from '../images/emoji.svg'
import styles from '../styles/Chat.module.css'
import Messages from "./Messages";

const socket = io.connect('https://simple-chat-server-d98x.onrender.com');

const Chat = () => {
    const {search} = useLocation();
    const navigate = useNavigate();
    const [params, setParams] = useState({user: "", room: ""});
    const [state, setState] = useState([]);
    const [message, setMessage] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [roomUsers, setRoomUsers] = useState(0);

    useEffect(() => {
        const searchParams = Object.fromEntries(new URLSearchParams(search))
        setParams(searchParams);

        socket.emit('join', searchParams)
    }, [search]);

    useEffect(() => {
        socket.on('message', ({data}) => {
            setState((_state) => ([..._state, data]))
        })
    }, [])

    useEffect(() => {
        socket.on('room', ({data: {users}}) => {
            setRoomUsers(users.length)
        })
    }, [])

    const leftRoom = () => {
        socket.emit('leftRoom', {params});

        navigate('/');
    };

    const handleChange = ({target: {value}}) => setMessage(value);

    const onEmojiClick = ({emoji}) => setMessage(`${message} ${emoji}`);
    
    const handleSubmit = (e) => {
        e.preventDefault();

        if(!message) return;

        socket.emit('sendMessage', {message, params});

        setMessage('');
    };

    return (
        <div className={styles.wrap}>
            <div className={styles.header}>
                <div className={styles.title}>{params.room}</div>
                <div className={styles.users}>{roomUsers} users in this room</div>
                <button 
                type="button" 
                className={styles.left} 
                onClick={leftRoom}>
                    Left the room
                </button>
            </div>
            <div className={styles.messages}>
                <Messages messages={state} name={params.name}/>
            </div>
            <form className={styles.form} onSubmit={handleSubmit} >
                <div className={styles.input}>
                    <input 
                        type="text" 
                        name="name" 
                        value={message} 
                        placeholder="Write your message"
                        onChange={handleChange} 
                        autoComplete="off"
                        required
                    />
                </div>
                <div className={styles.emoji}>
                    <img src={icon} alt="" onClick={() => setIsOpen(!isOpen)} />
                    {isOpen && 
                    <div className={styles.emojies}>
                        <EmojiPicker onEmojiClick={onEmojiClick} />
                    </div>}
                </div>
                <div className={styles.button}>
                    <input type="submit" value="Send message"/>
                </div>
            </form>
        </div>
    )
}

export default Chat;