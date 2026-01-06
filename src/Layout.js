import React from 'react'
import Header from './Layout/Header'
import { Outlet } from 'react-router-dom' 
import Sidebar from './Layout/Sidebar'
const Layout = () => {
  return (
    <div>
      <Sidebar/>
      <Header/>
       <div className='main-wrapper'>
          <Outlet/>
       </div>
    </div>
  )
}

export default Layout
