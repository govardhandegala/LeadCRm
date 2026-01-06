import React, { useEffect, useState } from "react";
import { Table, Modal, Form, Input, Button, Select } from "antd";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import "./products.css";
import AddProducts from "../Products/AddProducts";
import EditProducts from "../Products/EditProduct";
import Instance from "../../AxiosConfig";

const { confirm } = Modal;
const LOCAL_PRODUCTS_KEY = "local_products";

const ProductsTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");

  const [fetchData, setFetchData] = useState([]);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // 🔹 FETCH PRODUCTS (API + LOCAL)
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await Instance.get("/products");

      if (response.status === 200) {
        let apiProducts = response.data.map((item) => ({
          ...item,
          key: item.id,
          isLocal: false,
        }));

        // 🔥 Load local products
        const localProducts =
          JSON.parse(localStorage.getItem(LOCAL_PRODUCTS_KEY)) || [];

        let data = [...localProducts, ...apiProducts];

        // 🔍 SEARCH
        if (search) {
          data = data.filter(
            (item) =>
              item.title.toLowerCase().includes(search.toLowerCase()) ||
              item.description.toLowerCase().includes(search.toLowerCase())
          );
        }

        // 🔍 TITLE
        if (title) {
          data = data.filter((item) =>
            item.title.toLowerCase().includes(title.toLowerCase())
          );
        }

        // 🔍 CATEGORY
        if (category) {
          data = data.filter((item) => item.category === category);
        }

        // 🔍 PRICE
        if (price) {
          data = data.filter((item) => item.price <= Number(price));
        }

        setFetchData(data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🔹 ADD PRODUCT (LOCAL + UI)
 const addProductOptimistically = (newProduct) => {
  const product = {
    ...newProduct,
    id: `local-${Date.now()}`,
    key: `local-${Date.now()}`,
    isLocal: true,
  };

  const stored =
    JSON.parse(localStorage.getItem(LOCAL_PRODUCTS_KEY)) || [];

  localStorage.setItem(
    LOCAL_PRODUCTS_KEY,
    JSON.stringify([product, ...stored])
  );

  setFetchData((prev) => [product, ...prev]);
};

// 🔹 UPDATE PRODUCT (LOCAL + UI) ✅ ADD THIS HERE
const updateProductOptimistically = (updatedProduct) => {
  const stored =
    JSON.parse(localStorage.getItem(LOCAL_PRODUCTS_KEY)) || [];

  const updatedStored = stored.map((p) =>
    p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p
  );

  localStorage.setItem(
    LOCAL_PRODUCTS_KEY,
    JSON.stringify(updatedStored)
  );

  setFetchData((prev) =>
    prev.map((p) =>
      p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p
    )
  );
};

  // 🔹 DELETE PRODUCT
  const deleteProduct = async (record) => {
    if (record.isLocal) {
      const stored =
        JSON.parse(localStorage.getItem(LOCAL_PRODUCTS_KEY)) || [];

      const updated = stored.filter((p) => p.id !== record.id);
      localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(updated));

      setFetchData((prev) => prev.filter((p) => p.id !== record.id));
      return;
    }

    await Instance.delete(`/products/${record.id}`);
    fetchProducts();
  };

  const showDeleteConfirm = (record) => {
    confirm({
      title: `Are you Sure Want to Delete This file "${record.title}"?`,
      okType: "danger",
      onOk() {
        deleteProduct(record);
      },
    });
  };

  // 🔹 TABLE COLUMNS
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      render: (text = "") =>
  text.length > 100 ? text.slice(0, 100) + "..." : text,

    },
    {
      title: "Price",
      dataIndex: "price",
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (text = "") =>
  text.length > 200 ? text.slice(0, 200) + "..." : text,

    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Actions",
      render: (_, record) => (
        <div className="d-flex gap-2">
          <FiEdit
            size={18}
            style={{ cursor: "pointer", color: "#1890ff" }}
            onClick={() => {
              setSelectedData(record);
              setShowEditModal(true);
            }}
          />
          <FiTrash2
            size={18}
            style={{ cursor: "pointer", color: "red" }}
            onClick={() => showDeleteConfirm(record)}
          />
        </div>
      ),
    },
  ];

  const handleClearFilters = () => {
    setSearch("");
    setTitle("");
    setPrice("");
    setCategory("");
    fetchProducts();
  };

  return (
    <div>
      {/* FILTERS */}
      <div className="filter-card p-3">
        <Form layout="vertical" onFinish={fetchProducts}>
          <div className="row g-3">
            <div className="col-md-3">
              <Form.Item label="Search">
                <Input value={search} onChange={(e) => setSearch(e.target.value)} />
              </Form.Item>
            </div>

            <div className="col-md-3">
              <Form.Item label="Category">
                <Select
                  allowClear
                  value={category || undefined}
                  onChange={(val) => setCategory(val || "")}
                >
                  <Select.Option value="electronics">Electronics</Select.Option>
                  <Select.Option value="jewelery">Jewelery</Select.Option>
                  <Select.Option value="men's clothing">Men</Select.Option>
                  <Select.Option value="women's clothing">Women</Select.Option>
                </Select>
              </Form.Item>
            </div>

            <div className="col-md-3">
              <Form.Item label="Title">
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              </Form.Item>
            </div>

            <div className="col-md-3">
              <Form.Item label="Price">
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </Form.Item>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-3 mt-3">
            <Button onClick={handleClearFilters}>CLEAR</Button>
            <Button type="primary" htmlType="submit">
              APPLY
            </Button>
          </div>
        </Form>
      </div>

      {/* TABLE */}
      <div className="products-page mt-4">
        <div className="d-flex justify-content-between align-items-center">
          <h1>Products List</h1>
          <button className="surve-export-btn" onClick={() => setShowModal(true)}>
            <FaPlus /> Add Product
          </button>
        </div>

        <Table
          className="mt-3"
          columns={columns}
          dataSource={fetchData}
          loading={loading}
          pagination={{
            pageSize: itemsPerPage,
            current: currentPage,
            onChange: setCurrentPage,
          }}
        />
      </div>

      {/* MODALS */}
      <AddProducts
        show={showModal}
        handleClose={() => setShowModal(false)}
        addProductOptimistically={addProductOptimistically}
      />

      <EditProducts
  show={showEditModal}
  handleClose={() => setShowEditModal(false)}
  productData={selectedData}
  updateProductOptimistically={updateProductOptimistically}
  fetchProducts={fetchProducts}
/>

    </div>
  );
};

export default ProductsTable;
