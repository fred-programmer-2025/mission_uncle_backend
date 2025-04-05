import { useEffect, useState, useRef, useCallback } from 'react';
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../styles/BannerStyle.scss";
import "../styles/UncleBackEnd.scss";
import { Modal } from 'bootstrap';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const defaultModalState = {
  id: "",
  name: ""
};

export default function OrderList() {
  const [isAuth, setIsAuth] = useState(false);
  const [isScreenLoading, setIsScreenLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [tempOrder, setTempOrder] = useState(defaultModalState);
  const navigate = useNavigate();

  // 取得訂單資料
  const getOrders = async () => {
    setIsScreenLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/${API_PATH}/admin/orders`);
      // 讀取資料庫訂單資料，並進行更新
      setOrders(res.data.orders);
    } catch {
      alert("取得訂單失敗");
    } finally {
      setIsScreenLoading(false);
    }
  }

  // 驗證是否已登入
  const checkUserLogin = useCallback(async () => {
    try {
      await axios.post(`${BASE_URL}/api/user/check`);
      getOrders();
      setIsAuth(true);
    } catch {
      alert("驗證登入失敗");
    }
  }, [])

  useEffect(() => {
    // 取得驗證token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, "$1");

    if (!token) {
      setTimeout(() => {
        navigate('/');
      }, 2000);;
    } else {
      // 進行驗證token
      axios.defaults.headers.common['Authorization'] = token;
      checkUserLogin();
    }

  }, [checkUserLogin, navigate])

  // delProductModal DOM元素
  const delOrderModalRef = useRef(null);
  const delOrderModalMethodRef = useRef(null);

  useEffect(() => {
    // delProductModalRef.current 存放Modal的變數
    delOrderModalMethodRef.current = new Modal(delOrderModalRef.current, {backdrop: false});
    delOrderModalRef.current.addEventListener('hide.bs.modal', () => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    });
  }, [])

  // 開啟DelOrderModal事件
  const handleDelOpenOrderModal = (order) => {
    setTempOrder({
      ...tempOrder,
      id: order.id,
      name: order.user.name
    });
    delOrderModalMethodRef.current.show();
  }

  // 關閉DelOrderModal事件
  const handleDelCloseOrderModal = () => {
    delOrderModalMethodRef.current.hide();
  }

  // 刪除訂單
  const deleteOrder = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/${API_PATH}/admin/order/${tempOrder.id}`);
    } catch {
      alert('刪除訂單失敗');
    }
  }

  // 刪除訂單事件
  const handleDelOrder = async () => {
    try {
      await deleteOrder();
      getOrders();
      handleDelCloseOrderModal();
    } catch {
      alert('刪除訂單失敗');
    }
  }

  return (
    <>
      <div className="banner d-flex align-items-center justify-content-start">
        <h2 className="text-start banner-title mb-2">訂單列表</h2>
      </div>
      {isAuth ? (
        <div className="container py-3">
          <div className="row">
            <div className="col">
              <table className="table table-bordered rounded-3 overflow-hidden text-center">
                <thead className="table-dark">
                  <tr>
                    <th scope="col">姓名</th>
                    <th scope="col">信件地址</th>
                    <th scope="col">電話</th>
                    <th scope="col">付款方式</th>
                    <th scope="col">是否付款</th>
                    <th scope="col">是否刪除</th>
                  </tr>
                </thead>
                <tbody>
                  {orders?.map((order) => (
                    <tr key={order.id}>
                      <th scope="row" style={{color: '#73DB6A'}}>{order.user.name}</th>
                      <td>{order.user.email}</td>
                      <td>{order.user.tel}</td>
                      <td>{order.user.payment}</td>
                      <td>{order.is_paid ? <span className="text-primary">已付款</span> : <span className="text-danger">未付款</span>}</td>
                      <td>
                      <div className="">
                        {/* <button type="button" className="btn btn-sm btn-edit me-2"><i className="bi bi-pencil">編輯</i></button> */}
                        <button type="button" className="btn btn-sm btn-delete ms-2" onClick={() => handleDelOpenOrderModal(order)}><i className="bi bi-trash">刪除</i></button>
                      </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : 
      (<div className="container" style={{
        height: '55vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center'}}>
        <h1 style={{
          fontSize: '2rem', 
          color: '#73DB6A', 
          fontWeight: 'bold', 
          textAlign: 'center', 
          letterSpacing: '2px', 
          textShadow: '2px 2px 8px rgba(0, 0, 0, 0.2)'}
        }>
          驗證權限中!!!
        </h1>
      </div>)}
      
      {isScreenLoading && (<div
        className="d-flex justify-content-center align-items-center"
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(255,255,255,0.3)",
          zIndex: 999
        }}
      >
      <ClipLoader 
        color={'#000000'}
        size={30}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      </div>)}
      
      <div
        ref={delOrderModalRef}
        className="modal fade"
        id="delProductModal"
        tabIndex="-1"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">刪除訂單</h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={handleDelCloseOrderModal}
              ></button>
            </div>
            <div className="modal-body">
              你是否要刪除 
              <span className="text-danger fw-bold">{tempOrder.name}</span>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-sm btn-edit"
                onClick={handleDelCloseOrderModal}
              >
                取消
              </button>
              <button type="button" className="btn btn-sm btn-delete" onClick={handleDelOrder}>
                刪除
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
