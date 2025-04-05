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
  imageUrl: "",
  title: "",
  category: "",
  unit: "",
  origin_price: "",
  price: "",
  description: "",
  content: "",
  is_enabled: 0,
  imagesUrl: [""]
};

export default function UncleList() {
  const [isAuth, setIsAuth] = useState(false);
  const [isScreenLoading, setIsScreenLoading] = useState(false);
  const [tempProduct, setTempProduct] = useState(defaultModalState);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // 取得產品資料
  const getProducts = async () => {
    setIsScreenLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/${API_PATH}/admin/products`);
      // 讀取資料庫產品資料，並進行更新
      setProducts(res.data.products);
    } catch {
      alert("取得產品失敗");
    } finally {
      setIsScreenLoading(false);
    }
  }

  // 驗證是否已登入
  const checkUserLogin = useCallback(async () => {
    try {
      await axios.post(`${BASE_URL}/api/user/check`);
      getProducts();
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

  // 取得productModal DOM元素
  const productModalRef = useRef(null);
  // delProductModal DOM元素
  const delProductModalRef = useRef(null);
  const productModalMethodRef = useRef(null);
  const delProductModalMethodRef = useRef(null);
  const [modalMode, setModalMode] = useState(null);

  useEffect(() => {
    // productModalMethodRef.current 存放Modal的變數
    productModalMethodRef.current = new Modal(productModalRef.current, {backdrop: false});
    productModalRef.current.addEventListener('hide.bs.modal', () => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    });

    // delProductModalRef.current 存放Modal的變數
    delProductModalMethodRef.current = new Modal(delProductModalRef.current, {backdrop: false});
    delProductModalRef.current.addEventListener('hide.bs.modal', () => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    });
  }, [])

  // 開啟ProductModal事件
  const handleOpenProductModal = (mode, product) => {
    // 設定新增或編輯Modal
    setModalMode(mode);

    if (mode === 'create') {
      // 全新ProductModal
      setTempProduct(defaultModalState);
    } else {
      // 原ProductModal
      setTempProduct(product);
    }

    productModalMethodRef.current.show();
  }

  // 關閉ProductModal事件
  const handleCloseProductModal = () => {
    productModalMethodRef.current.hide();
  }

  // 開啟DelProductModal事件
  const handleDelOpenProductModal = (product) => {
    setTempProduct(product);
    delProductModalMethodRef.current.show();
  }

  // 關閉DelProductModal事件
  const handleDelCloseProductModal = () => {
    delProductModalMethodRef.current.hide();
  }

  // Input為checkbox 帶入checked值
  const handleInputModalChange = (e) => {
    const { name, value, checked, type } = e.target;
    setTempProduct({
      ...tempProduct,
      [name]: type === "checkbox" ? checked : value
    })
  }

  // 圖片路徑變更事件
  const handleImageChange = (e, index) => {
    const { value } = e.target;
    const newImages = [...tempProduct.imagesUrl];
    newImages[index] = value;

    setTempProduct({
      ...tempProduct,
      imagesUrl: newImages
    })
  }

  // 新增圖片事件
  const handleAddImage = () => {
    const newImages = [...tempProduct.imagesUrl, ''];
    setTempProduct({
      ...tempProduct,
      imagesUrl: newImages
    })
  }

  // 刪除圖片事件
  const handleRemoveImage = () => {
    const newImages = [...tempProduct.imagesUrl];
    newImages.pop();
    setTempProduct({
      ...tempProduct,
      imagesUrl: newImages
    })
  }

  // 新增產品
  const creatProduct = async () => {
    try {
      await axios.post(`${BASE_URL}/api/${API_PATH}/admin/product`, {
        data: {
          ...tempProduct,
          origin_price: Number(tempProduct.origin_price),
          price: Number(tempProduct.price),
          is_enabled: tempProduct.is_enabled ? 1 : 0
        }
      });
    } catch {
      alert('新增產品失敗');
    }
  }

  // 編輯產品
  const updateProduct = async () => {
    try {
      await axios.put(`${BASE_URL}/api/${API_PATH}/admin/product/${tempProduct.id}`, {
        data: {
          ...tempProduct,
          origin_price: Number(tempProduct.origin_price),
          price: Number(tempProduct.price),
          is_enabled: tempProduct.is_enabled ? 1 : 0
        }
      });
    } catch {
      alert('新增產品失敗');
    }
  }

  // 更新產品事件
  const handleUpdateProduct = async () => {
    const apiCall = modalMode === 'create' ? creatProduct : updateProduct;
    try {
      await apiCall();
      getProducts();
      handleCloseProductModal();
    } catch {
      alert('更新產品失敗');
    }
  }

  // 刪除產品
  const deleteProduct = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/${API_PATH}/admin/product/${tempProduct.id}`);
    } catch {
      alert('刪除產品失敗');
    }
  }

  // 刪除產品事件
  const handleDelProduct = async () => {
    try {
      await deleteProduct();
      getProducts();
      handleDelCloseProductModal();
    } catch {
      alert('刪除產品失敗');
    }
  }

  return (
    <>
    <div className="banner d-flex align-items-center justify-content-start">
      <h2 className="text-start banner-title mb-2">大叔列表</h2>
    </div>
    {isAuth ? (
      <div className="container py-3">
        <div className="row">
          <div className="col">
            <div className="d-flex justify-content-end mb-3">
            <button type="button" className="btn btn-sm btn-edit" onClick={() => handleOpenProductModal('create')}>建立新的大叔</button>
            </div>
            <table className="table table-bordered rounded-3 overflow-hidden text-center">
              <thead className="table-dark">
                <tr>
                  <th scope="col">大叔名稱</th>
                  <th scope="col">原價</th>
                  <th scope="col">售價</th>
                  <th scope="col">是否啟用</th>
                  <th scope="col">是否修改</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <th scope="row" style={{color: '#73DB6A'}}>{product.title}</th>
                    <td>{`NT ${product.origin_price.toLocaleString({ style: 'currency', currency: 'TWD' })}`}</td>
                    <td>{`NT ${product.price.toLocaleString({ style: 'currency', currency: 'TWD' })}`}</td>
                    <td>{product.is_enabled ? <span className="text-primary">啟用</span> : <span className="text-danger">未啟用</span>}</td>
                    <td>
                    <div className="">
                      <button type="button" className="btn btn-sm btn-edit me-2" onClick={() => handleOpenProductModal('edit', product)}><i className="bi bi-pencil">編輯</i></button>
                      <button type="button" className="btn btn-sm btn-delete ms-2" onClick={() => handleDelOpenProductModal(product)}><i className="bi bi-trash">刪除</i></button>
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

    <div ref={productModalRef} id="productModal" className="modal" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content border-0 shadow">
          <div className="modal-header border-bottom">
            <h5 className="modal-title fs-4">{modalMode === 'create' ? '新增產品' : '編輯產品'}</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseProductModal}></button>
          </div>

          <div className="modal-body p-4">
            <div className="row g-4">
              <div className="col-md-4">
                <div className="mb-4">
                  <label htmlFor="primary-image" className="form-label">
                    主圖
                  </label>
                  <div className="input-group">
                    <input
                      value={tempProduct.imageUrl}
                      onChange={handleInputModalChange}
                      name="imageUrl"
                      type="text"
                      id="primary-image"
                      className="form-control"
                      placeholder="請輸入圖片連結"
                    />
                  </div>
                  <img
                    src={tempProduct.imageUrl}
                    alt={tempProduct.title}
                    className="img-fluid"
                  />
                </div>

                {/* 副圖 */}
                <div className="border border-2 border-dashed rounded-3 p-3">
                  {tempProduct.imagesUrl?.map((image, index) => (
                    <div key={index} className="mb-2">
                      <label
                        htmlFor={`imagesUrl-${index + 1}`}
                        className="form-label"
                      >
                        副圖 {index + 1}
                      </label>
                      <input
                        value={image}
                        onChange={(e) => handleImageChange(e, index)}
                        id={`imagesUrl-${index + 1}`}
                        type="text"
                        placeholder={`圖片網址 ${index + 1}`}
                        className="form-control mb-2"
                      />
                      {image && (
                        <img
                          src={image}
                          alt={`副圖 ${index + 1}`}
                          className="img-fluid mb-2"
                        />
                      )}
                    </div>
                  ))}
                  <div className="w-100 d-flex justify-content-between">
                    {tempProduct.imagesUrl.length < 5 && 
                    tempProduct.imagesUrl[tempProduct.imagesUrl.length - 1] !== '' && 
                    (<button className="btn btn-sm btn-edit me-2 w-100" onClick={handleAddImage}>新增圖片</button>)
                    }

                    {tempProduct.imagesUrl.length > 1 && 
                    (<button className="btn btn-sm btn-delete ms-2 w-100" onClick={handleRemoveImage}>取消圖片</button>)
                    }
                  </div>

                </div>
              </div>

              <div className="col-md-8">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    大叔名稱
                  </label>
                  <input
                    value={tempProduct.title}
                    onChange={handleInputModalChange}
                    name="title"
                    id="title"
                    type="text"
                    className="form-control"
                    placeholder="請輸入大叔名稱"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="category" className="form-label">
                    居住地
                  </label>
                  <input
                    value={tempProduct.category}
                    onChange={handleInputModalChange}
                    name="category"
                    id="category"
                    type="text"
                    className="form-control"
                    placeholder="請輸入居住地"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="unit" className="form-label">
                    規格
                  </label>
                  <input
                    value={tempProduct.unit}
                    onChange={handleInputModalChange}
                    name="unit"
                    id="unit"
                    type="text"
                    className="form-control"
                    placeholder="請輸入規格"
                  />
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <label htmlFor="origin_price" className="form-label">
                      原價
                    </label>
                    <input
                      value={tempProduct.origin_price}
                      onChange={handleInputModalChange}
                      name="origin_price"
                      id="origin_price"
                      type="number"
                      className="form-control"
                      placeholder="請輸入原價"
                    />
                  </div>
                  <div className="col-6">
                    <label htmlFor="price" className="form-label">
                      售價
                    </label>
                    <input
                      value={tempProduct.price}
                      onChange={handleInputModalChange}
                      name="price"
                      id="price"
                      type="number"
                      className="form-control"
                      placeholder="請輸入售價"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    大叔專長
                  </label>
                  <textarea
                    value={tempProduct.description}
                    onChange={handleInputModalChange}
                    name="description"
                    id="description"
                    className="form-control"
                    rows={4}
                    placeholder="請輸入大叔專長"
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label htmlFor="content" className="form-label">
                    語言種類
                  </label>
                  <textarea
                    value={tempProduct.content}
                    onChange={handleInputModalChange}
                    name="content"
                    id="content"
                    className="form-control"
                    rows={4}
                    placeholder="請輸入語言種類"
                  ></textarea>
                </div>

                <div className="form-check">
                  <input
                    checked={tempProduct.is_enabled}
                    onChange={handleInputModalChange}
                    name="is_enabled"
                    type="checkbox"
                    className="form-check-input"
                    id="isEnabled"
                  />
                  <label className="form-check-label" htmlFor="isEnabled">
                    是否啟用
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer border-top bg-light">
            <button type="button" className="btn btn-sm btn-delete" onClick={handleCloseProductModal}>
              取消
            </button>
            <button type="button" className="btn btn-sm btn-edit" onClick={handleUpdateProduct}>
              確認
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      ref={delProductModalRef}
      className="modal fade"
      id="delProductModal"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5">刪除大叔</h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={handleDelCloseProductModal}
            ></button>
          </div>
          <div className="modal-body">
            你是否要刪除 
            <span className="text-danger fw-bold">{tempProduct.title}</span>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-sm btn-edit"
              onClick={handleDelCloseProductModal}
            >
              取消
            </button>
            <button type="button" className="btn btn-sm btn-delete" onClick={handleDelProduct}>
              刪除
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
