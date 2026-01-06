import React, { useEffect, useState } from "react";
import { Table, Dropdown, Modal, Form, Input, Button, Select } from "antd";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import "./products.css";
import AddProducts from "../Products/AddProducts";
import EditProducts from "../Products/EditProduct";
import Instance from "../../AxiosConfig";

const { confirm } = Modal; // Ant Design confirm method

const ProductsTable = () => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  const [productsData, setProductsData] = useState([
    {
      key: "1",
      agentName: "Levon techno",
      companyCount: "IT Services",
      agentEmail: "levon@gmail.com",
      agentNumber: "1234567890",
    },
    {
      key: "2",
      agentName: "Wipro",
      companyCount: "IT Services",
      agentEmail: "vardhan@gmail.com",
      agentNumber: "1234567891",
    },
    {
      key: "3",
      agentName: "Tech Mahindra",
      companyCount: "IT Services",
      agentEmail: "email@gmail.com",
      agentNumber: "1234567892",
    },
    {
      key: "4",
      agentName: "TCS",
      companyCount: "IT Services",
      agentEmail: "jio@gmail.com",
      agentNumber: "1234567893",
    },
  ]);

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetchData, setFetchData] = useState([]);
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const url = category ? `/products/category/${category}` : "/products";

      const response = await Instance.get(url);

      if (response.status === 200) {
        let data = response.data;

        // 🔍 Client-side search (title + description)
        if (search) {
          data = data.filter(
            (item) =>
              item.title.toLowerCase().includes(search.toLowerCase()) ||
              item.description.toLowerCase().includes(search.toLowerCase())
          );
        }

        // 🔍 Title filter
        if (title) {
          data = data.filter((item) =>
            item.title.toLowerCase().includes(title.toLowerCase())
          );
        }

        // 🔍 Price filter
        if (price) {
          data = data.filter((item) => item.price <= Number(price));
        }

        const formattedData = data.map((item) => ({
          ...item,
          key: item.id,
        }));

        setFetchData(formattedData);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

 
const deleteProduct = async (productId) => {
  try {
    const response = await Instance.delete(`/products/${productId}`);

    console.log("delete product",response);
    if (response.status === 200 || response.status === 201) {
      console.log("Deleted:", response.data);
      fetchProducts();  
    }
  } catch (error) {
    console.error(
      "Delete failed:",
      error.response?.data || error.message
    );
  }
};

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleModalClick = (key, record) => {
    setSelectedData(record);
    if (key === "edit") {
      setShowEditModal(true);
    } else if (key === "delete") {
      showDeleteConfirm(record);
    }
  };

  const showDeleteConfirm = (record) => {
    confirm({
      title: `Are you sure you want to delete "${record.title}"?`,
      centered: true,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      async onOk() {
        await deleteProduct(record.id);
      },
      onCancel() {
        console.log("Cancel delete");
      },
    });
  };

  const getMenuItems = (record) => [
    {
      key: "edit",
      label: "Edit",
      onClick: () => handleModalClick("edit", record),
    },
    {
      key: "delete",
      label: "Delete",
      onClick: () => handleModalClick("delete", record),
    },
  ];

  const columns = [
  {
    title: "Title",
    dataIndex: "title",
    render: (text) =>
      text.length > 100 ? text.slice(0, 100) + "..." : text,
  },
  {
    title: "Price",
    dataIndex: "price",
  },
  {
    title: "Description",
    dataIndex: "description",
    render: (text) =>
      text.length > 200 ? text.slice(0, 200) + "..." : text,
  },
  {
    title: "Category",
    dataIndex: "category",
    render: (text) =>
      text.length > 50 ? text.slice(0, 50) + "..." : text,
  },
  {
    title: "Actions",
    key: "actions",
    render: (_, record) => (
      <div className="d-flex gap-2">
        {/* Edit icon */}
        <FiEdit
          style={{ cursor: "pointer", color: "#1890ff" }}
          size={18}
          onClick={() => {
            setSelectedData(record);
            setShowEditModal(true);
          }}
        />

        {/* Delete icon */}
        <FiTrash2
          style={{ cursor: "pointer", color: "red" }}
          size={18}
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
      <div className="filter-card p-3">
        <Form layout="vertical" onFinish={() => fetchProducts()}>
          <div className="row g-3">
            {/* Search */}
            <div className="col-md-3 col-sm-12">
              <Form.Item label="Search">
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  allowClear
                />
              </Form.Item>
            </div>

            <div className="col-md-3 col-sm-12">
              <Form.Item label="Category">
                <Select
                  value={category || undefined}
                  onChange={(value) => setCategory(value || "")}
                  placeholder="Select category"
                  allowClear
                  className="w-100"
                  popupMatchSelectWidth={false}
                  getPopupContainer={(trigger) => trigger.parentElement}
                >
                  <Select.Option value="electronics">Electronics</Select.Option>
                  <Select.Option value="jewelery">Jewelery</Select.Option>
                  <Select.Option value="men's clothing">
                    Men's Clothing
                  </Select.Option>
                  <Select.Option value="women's clothing">
                    Women's Clothing
                  </Select.Option>
                </Select>
              </Form.Item>
            </div>

            {/* Title */}
            <div className="col-md-3 col-sm-12">
              <Form.Item label="Title">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter product title"
                  allowClear
                />
              </Form.Item>
            </div>

            {/* Price */}
            <div className="col-md-3 col-sm-12">
              <Form.Item label="Price">
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter price"
                  allowClear
                />
              </Form.Item>
            </div>
          </div>

          {/* Buttons */}
          <div className="d-flex justify-content-end gap-4 mt-3">
            <Button
              htmlType="button"
              className="clear-btn-company"
              onClick={handleClearFilters}
            >
              CLEAR FILTERS
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="clear-btn-company"
            >
              SUBMIT
            </Button>
          </div>
        </Form>
      </div>

      <div className="products-page mt-5">
        <div className="products-table mt-3">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="agents-heading-h1">Products List</h1>
            <div className="d-flex align-items-center gap-3 table-header-buttons">
              <button className="surve-export-btn" onClick={handleShow}>
                <FaPlus /> Add Product
              </button>
            </div>
          </div>
          <div className="mt-4">
            <Table
              columns={columns}
              dataSource={fetchData}
              loading={loading}
              pagination={{
                pageSize: itemsPerPage,
                current: currentPage,
                onChange: (page) => setCurrentPage(page),
                className: "custom-pagination",
              }}
              scroll={{ x: "max-content" }}
            />
          </div>
        </div>
      </div>

      {/* Add and Edit Modals */}
      <AddProducts
        show={showModal}
        handleClose={handleClose}
        fetchProducts={fetchProducts}
      />
      <EditProducts
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        fetchProducts={fetchProducts}
        productData={selectedData}
      />
    </div>
  );
};

export default ProductsTable;
