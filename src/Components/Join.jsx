import React, { useState } from 'react'
import {app} from '../firebase'
import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth'

const Join = ({history}) => {
    const auth = getAuth(app);

    const [form, setForm] = useState({
        email: 'user03@email.com', password: '12341234'
    });

    const {email, password} = form;

    const onSubmit = (e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
        .then((success)=>{
            alert("회원가입 성공");
            history.push("/login")
        })
        .catch((error)=>{
            alert("회원가입 실패"+error.message)
        })
    };

    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]:e.target.value
        });
    };

    return (
        <div>
            <h1>회원가입</h1>
            <form className='login' onSubmit={onSubmit}>
                <input name="email" value={email} onChange={onChange} />
                <input type="password" name="password" value={password} onChange={onChange} />
                <button className='button'>회원가입</button>
            </form>
        </div>
    )
}

export default Join