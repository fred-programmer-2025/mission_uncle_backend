import React from "react";
import { Link } from "react-router-dom";
import uncleLogo from "../assets/Logo.svg";

const Footer = () => {
  return (
  <footer className="py-4" style={{ backgroundColor: "#E0E0E0" }}>
    <div className="container">
      <div className="row w-100">
        <div className="d-md-flex d-flex-column justify-content-center justify-content-md-between align-items-center">
          {/* 左側 LOGO (貼齊最左) */}
          <div className="col-md-2 col-12 mb-3 mb-md-0 text-center text-md-start">
            <img src={uncleLogo} alt="大叔出任務" style={{ maxWidth: "120px" }} />
          </div>

          {/* 右側 GitHub & 版權 (貼齊最右) */}
          <div className="col-md-10 col-12 text-center text-md-end ms-md-auto">
            <div>
              <Link to="https://github.com/fred-programmer-2025/mission_uncle" target="_blank" className="text-dark text-decoration-none fw-bold me-3">GitHub</Link>
              <Link to="/admin" target="_blank" className="text-dark text-decoration-none fw-bold">管理後台</Link>
            </div>
            <p className="mb-0 mt-1 fw-bold" style={{ fontSize: "12px" }}>Copyright © 2024 大叔出任務 All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </div>
  </footer>
  );
};

export default Footer;