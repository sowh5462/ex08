import React, { useEffect, useState } from 'react'
import { app } from '../firebase'
import { getDatabase, ref, onValue, remove } from 'firebase/database'

const Cart = () => {
    const db = getDatabase(app);
    const [cart, setCart] = useState(null);

    const callAPI = async() => {
        let email = sessionStorage.getItem('email');
        email = email.replace('@', '').replace('.', '');
        onValue(ref(db, `cart/${email}`), (snapshot)=>{
            let rows = [];
            snapshot.forEach(row=>{
                rows.push(row.val());
            });
            console.log(rows);
            setCart(rows)
        });
    };

    useEffect(()=>{
        callAPI();
    }, []);

    const onClickDelete = (id) => {
        if(!window.confirm(`${id}번 상품을 삭제하실래요`)) return;

        let email = sessionStorage.getItem('email');
        email = email.replace('@', '').replace('.', '');
        remove(ref(db, `cart/${email}/${id}`));
    };

    if(cart === null) return <h1>Loading...</h1>
    return (
        <div>
            <h1>장바구니</h1>
            <table>
                <thead>
                    <tr>
                        <td>상품번호</td>
                        <td>상품이미지</td>
                        <td>상품이름</td>
                        <td>상품가격</td>
                        <td>삭제</td>
                    </tr>
                </thead>
                <tbody>
                    {cart.map(c=>
                        <tr key={c.productId} className="row">
                            <td>{c.productId}</td>
                            <td className='img'><a href={c.link}><img src={c.image}/></a></td>
                            <td dangerouslySetInnerHTML={{ __html: c.title }}></td>
                            <td>{c.lprice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원</td>
                            <td><button className='button' onClick={()=>onClickDelete(c.productId)}>삭제</button></td>
                        </tr>    
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default Cart