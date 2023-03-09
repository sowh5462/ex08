import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { app } from '../firebase'
import { getDatabase, push, ref, set } from 'firebase/database'

const Products = ({history}) => {
    const [products, setProducts] = useState(null);
    const [query, setQuery] = useState('노트북');

    const db = getDatabase(app);

    const callAPI = async () => {
        const url = "/v1/search/shop.json";
        const config = {
            headers: { "X-Naver-Client-Id": "U0pl4cmLNMx5TDNKURwX", "X-Naver-Client-Secret": "B3BJkxo9DT" },
            params: { query: query, display: 8, start: 1 }
        }
        const result = await axios(url, config);
        setProducts(result.data.items);
    };

    useEffect(() => {
        callAPI()
    }, []);

    const onSubmit = (e) => {
        e.preventDefault();
        callAPI()
    };

    const onClickCart = (product) => {
        if(!sessionStorage.getItem('email')){
            alert('로그인 후 이용 가능합니다.');
            history.push('/login');
        }else{
            console.log(product);
            let email = sessionStorage.getItem('email');
            email = email.replace('@', '').replace('.', '');
            set(ref(db, `cart/${email}/${product.productId}`), product);
            alert('장바구니 담기 성공');
        }
    };

    if (products === null) return <h1>Loading...</h1>
    return (
        <div>
            <h1>상품검색</h1>
            <form className='form' onSubmit={onSubmit}>
                <input value={query} onChange={(e)=>setQuery(e.target.value)} />
                <button className='button'>검색</button>
            </form>
            <div className='container'>
                {products.map(p =>
                    <div className='box' key={p.productId}>
                        <img src={p.image} />
                        <div className='ellipsis title' dangerouslySetInnerHTML={{ __html: p.title }}></div>
                        <div>{p.lprice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원</div>
                        <button className='button' onClick={()=>onClickCart(p)}>장바구니</button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Products