import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './Layout'
import ProductsTableMain from './Pages/products/ProductsTableMain'
import AddProducts from './Components/Products/AddProducts'

const Router = () => {
  return (
     <BrowserRouter>
         <Routes>
            <Route element={<Layout/>}>
              <Route path='/' element={<ProductsTableMain/>}/>
              <Route path='/add-product' element={<AddProducts/>} />
            </Route>
         </Routes>
     </BrowserRouter>
  )
}

export default Router
