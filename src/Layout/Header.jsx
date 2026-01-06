import { useState } from "react";
import "./layout.css";
import leadcrm_logo from "../Assets/Logos/Leadcrm-Logo.png";
import { CiLogin } from "react-icons/ci";
import { FaBars, FaTimes } from "react-icons/fa";
import Sidebar from "./Sidebar"; // import Sidebar here

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      
      <div className="header desktop-header">
        <input
          type="text"
          className="form-control header-input"
          placeholder="search.."
        />

        <div className="btn-section">
          <button className="header-btn">Get Your Free Account</button>
          <button className="login-btn">
            <CiLogin /> LogIn
          </button>
        </div>
      </div>

      {/* MOBILE HEADER */}
      <div className="header mobile-header">
        <button className="menu-toggle-btn" onClick={toggleMenu}>
          {mobileMenuOpen ? <FaTimes size={26} /> : <FaBars size={26} />}
        </button>

        <div className="btn-section mobile-btns">
          <button className="header-btn">Get Your Free Account</button>
          <button className="login-btn">
            <CiLogin /> LogIn
          </button>
        </div>
      </div>

      {/* MOBILE SIDEBAR */}
      <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
};

export default Header;
