import React from "react";
import logo1 from "../Assets/Logos/Leadcrm-Logo.png";
import { MdOutlineDashboard } from "react-icons/md";
import { LuBuilding2 } from "react-icons/lu";
import { AiOutlineSafety } from "react-icons/ai";
import { GrCertificate } from "react-icons/gr";
import { TbScanEye, TbRefresh } from "react-icons/tb";
import { GoShieldX } from "react-icons/go";
import { FiUsers, FiUserPlus } from "react-icons/fi";
import { IoNotificationsOutline, IoSettingsOutline } from "react-icons/io5";
import { LuNotebookPen } from "react-icons/lu";
import { CiCircleQuestion } from "react-icons/ci";
import "./layout.css";
import { NavLink } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <aside className="sidebar-content">
        {/* Sidebar Header */}
        <div className="sidebar-close-btn">
          <button onClick={onClose}>
            <FaTimes size={24}   />
          </button>
        </div>
        <div className="sidebar-header">
          <img src={logo1} alt="Logo" className="sidebar-logo" />
          {/* <h3>EQCAS</h3> */}
        </div>

        {/* Sidebar Navigation */}
        <nav className="sidebar-nav mt-2">
          {/* Top Menu */}
          <div className="sidebar-nav-links sidebar-nav-top">
            <ul>
              <li>
                <a className="nav-link">
                  <MdOutlineDashboard className="sidebar-icon" />
                  Dashboard
                </a>
              </li>

              <li>
                <NavLink to="/" className="nav-link">
                  <LuBuilding2 className="sidebar-icon" />
                  Products
                </NavLink>
              </li>

               

               

               

               

               

               

              <li>
                <a className="nav-link">
                  <FiUsers className="sidebar-icon" />
                  Agents
                </a>
              </li>

              <li>
                <a className="nav-link">
                  <FiUserPlus className="sidebar-icon" />
                  Add Users
                </a>
              </li>

              <li>
                <a className="nav-link">
                  <IoNotificationsOutline className="sidebar-icon" />
                  Notifications
                </a>
              </li>

              <li>
                <a className="nav-link">
                  <LuNotebookPen className="sidebar-icon" />
                  Reports
                </a>
              </li>
            </ul>
          </div>

          {/* Bottom Menu */}
          <div className="sidebar-nav-links sidebar-nav-bottom">
            <ul>
              <li>
                <a className="nav-link">
                  <CiCircleQuestion className="sidebar-icon" />
                  Reports Analytics
                </a>
              </li>

              <li>
                <a className="nav-link">
                  <IoSettingsOutline className="sidebar-icon" />
                  Settings
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;
