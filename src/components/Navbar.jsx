import { useState }  from "react";
import { Link } from "react-router-dom";
import uncleLogo from "../assets/Logo.svg";
import "../styles/Navbar.scss";

const closeIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 6L18 18" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
  );

const Navbar = () => {
    // ✅ 定義 menuOpen 狀態
    const [menuOpen, setMenuOpen] = useState(false);

    // ✅ 點擊漢堡選單時，切換 menuOpen 的狀態
    const toggleMenu = () => {
      setMenuOpen(!menuOpen);
    };

  return (
    <>
      <nav className="navbar navbar-expand-xxl navbar-light d-none d-md-block navbar-gray">
        <div className="container">
          {/* 左側 LOGO，點擊回到首頁 */}
          <Link className="navbar-brand ml-5" to="/">
            <img className="ms-xl-1 ms-md-5 ps-md-5" src={ uncleLogo } alt="" />
          </Link>

          {/* 選單按鈕 */}
          <div>
            <Link className="me-4 fw-bold text-dark text-decoration-none navbar-link" to="/unclelist">大叔列表</Link>
            <Link className="me-4 fw-bold text-dark text-decoration-none navbar-link" to="/orderlist">訂單列表</Link>
          </div>
        </div>
      </nav>
      {/* ✅ 手機版 Navbar（MD 以下） */}
      <nav className="navbar navbar-light d-md-none">
        <div className="container d-flex align-items-center">
          {/* 漢堡選單按鈕 */}
          <button className="navbar-toggler" type="button" onClick={toggleMenu}>
            {menuOpen ? closeIcon : "☰"}
          </button>

          {/* LOGO */}
          <Link className="navbar-brand" to="/">
            <img src={ uncleLogo } style={{ width: '100px' }} alt="大叔出任務" />
          </Link>
        </div>

        {/* ✅ 手機版選單（滑動展開） */}
        <div className={`mobile-menu ${menuOpen ? "show" : ""}`}>
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link className="menu-item" to="/unclelist" onClick={toggleMenu}>
                大叔列表
              </Link>
            </li>
            <li className="nav-item">
              <Link className="menu-item" to="/orderlist" onClick={toggleMenu}>
                訂單列表
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
