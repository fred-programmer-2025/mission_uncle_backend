import { useState, useEffect } from 'react';
import { useNavigate } from "react-router";
import { ClipLoader } from "react-spinners";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../styles/BannerStyle.scss";
import "../styles/UncleBackEnd.scss";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Admin() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [account, setAccount] = useState(
        {
          username: "example@test.com",
          password: "example"
        }
    )

    // 登入畫面Input內容，處理帳號與密碼
    const handleInput = (e) => {
        const {name, value} = e.target;
        setAccount({
        ...account,
        [name]: value
        })
    }

    // 登入按鈕事件
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // 透過axios連線API
            const res = await axios.post(`${BASE_URL}/admin/signin`, account);

            // 取得token, expired
            const { token, expired } = res.data;

            // 由cookie內暫存token與到期時間
            document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;

            // 顯示大叔列表
            navigate('/unclelist');
        
        } catch (error) {
            alert("登入失敗");
        } finally {
            setIsLoading(false);
        }
    }

    // 驗證是否已登入
    const checkUserLogin = async () => {
        try {
            await axios.post(`${BASE_URL}/api/user/check`);
            navigate('/unclelist');
        } catch (error) {
            alert(error);
        }
    }

    useEffect(() => {
        // 取得驗證token
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, "$1");

        if (!token) {
            return;
        } else {
            // 進行驗證token
            axios.defaults.headers.common['Authorization'] = token;
            checkUserLogin();
        }
    }, [])

    return (
        <>
        <div className="banner d-flex align-items-center justify-content-start">
            <h2 className="text-start banner-title mb-2">使用者登入</h2>
        </div>
        <div className="d-flex flex-column justify-content-center align-items-center vh-100 border border-dark">
            <form onSubmit={handleLogin} id="form-login" className="d-flex flex-column gap-2">
                <div className="form-floating mb-3">
                <input onChange={handleInput} name="username" value={account.username} type="email" className="form-control" id="username" placeholder="name@example.com" />
                <label htmlFor="username">Email address</label>
                </div>
                <div className="form-floating">
                <input onChange={handleInput} name="password" value={account.password} type="password" className="form-control" id="password" placeholder="Password" />
                <label htmlFor="password">Password</label>
                </div>
                <button className="btn btn-sm btn-edit">
                    登入
                    {isLoading && <ClipLoader 
                    color={'#000000'}
                    size={15}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                    />}
                </button>
            </form>
            <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 大叔出任務</p>
        </div>
        </>
    )
}