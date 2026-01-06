import React, { useState } from "react";
import "./products.css";
import { Modal } from "react-bootstrap";
import { message, Spin } from "antd";
import {
  AiOutlineEye,
  AiOutlineDownload,
  AiOutlineDelete,
} from "react-icons/ai";
import { MdOutlineFileUpload } from "react-icons/md";
import Instance from "../../AxiosConfig";

const AddProducts = ({ show, handleClose, addProductOptimistically }) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
const [modalImageSrc, setModalImageSrc] = useState(null);

const handleClosePreview = () => {
  if (modalImageSrc && !modalImageSrc.startsWith("http")) {
    URL.revokeObjectURL(modalImageSrc);
  }
  setModalImageSrc(null);
  setShowModal(false);
};


  // 🔹 ADD PRODUCT
  const addProducts = async () => {
    if (!title || !price || !description || !category) {
      message.warning("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const imagePreview =
        uploadedFiles.length > 0
          ? URL.createObjectURL(uploadedFiles[0].file)
          : "https://i.pravatar.cc/300";

      const response = await Instance.post("/products", {
        title,
        price: Number(price),
        description,
        category,
        image: imagePreview, // 👈 local preview URL
      });

      console.log("adding product", response);

      if (response.status === 200 || response.status === 201) {
        message.success("Product added successfully!");

        // 🔥 Persist locally + show in table
        addProductOptimistically(response.data);

        resetForm();
        handleClose();
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setPrice("");
    setDescription("");
    setCategory("");
    setUploadedFiles([]);
  };

  // 🔹 FILE HANDLING (UI ONLY)
 const handleFileChange = (e) => {
  const files = Array.from(e.target.files);
  const newFiles = files.map((file) => ({
    name: file.name,
    size: (file.size / 1024).toFixed(1) + " Kb",
    date: new Date().toLocaleDateString(),
    file,
  }));
  setUploadedFiles((prev) => [...prev, ...newFiles]);
};


const handleDrop = (e) => {
  e.preventDefault();
  const files = Array.from(e.dataTransfer.files);
  handleFileChange({ target: { files } });
};

const handleDragOver = (e) => e.preventDefault();


  return (
    <>
      {/* ADD PRODUCT MODAL */}
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Product</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="container-fluid">
            <div className="row">
              {/* TITLE */}
              <div className="col-md-12 mb-3">
                <label className="form-label">Title</label>
                <input
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter title"
                />
              </div>

              {/* PRICE */}
              <div className="col-md-12 mb-3">
                <label className="form-label">Price</label>
                <input
                  type="number"
                  className="form-control"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter price"
                />
              </div>

              {/* DESCRIPTION */}
              <div className="col-md-12 mb-3">
                <label className="form-label">Description</label>
                <textarea
                  rows={4}
                  className="form-control"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* CATEGORY */}
              <div className="col-md-12 mb-3">
                <label className="form-label">Category</label>
                <input
                  className="form-control"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="electronics / men's clothing"
                />
              </div>

              {/* IMAGE UPLOAD (UI ONLY) */}
              <div className="col-md-12 mb-3">
                <label className="form-label">Image</label>
                <div className="upload-box">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    id="uploadInput"
                  />
                  <p
                    onClick={() =>
                      document.getElementById("uploadInput").click()
                    }
                  >
                    Drag & Drop or <span>Click to Upload</span>
                    <MdOutlineFileUpload />
                  </p>
                </div>
              </div>

              {/* FILE TABLE */}
              {uploadedFiles.length > 0 && (
                <table className="file-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Size</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uploadedFiles.map((file, index) => (
                      <tr key={index}>
                        <td>{file.name}</td>
                        <td>{file.size}</td>
                        <td>{file.date}</td>
                        <td>
                          <AiOutlineEye
  className="action-icon"
  onClick={() => {
    const fileURL = file.url
      ? file.url
      : URL.createObjectURL(file.file);

    setModalImageSrc(fileURL);
    setShowModal(true);
  }}
/>

                          <AiOutlineDelete
                            onClick={() =>
                              setUploadedFiles((prev) =>
                                prev.filter((_, i) => i !== index)
                              )
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* ACTION BUTTONS */}
              <div className="d-flex justify-content-end gap-2 mt-4">
                <button className="discard-btn" onClick={handleClose}>
                  Cancel
                </button>
                <button
                  className="save-btn"
                  onClick={addProducts}
                  disabled={loading}
                >
                  {loading ? <Spin size="small" /> : "Save"}
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* IMAGE PREVIEW */}
      <Modal show={showModal} onHide={handleClosePreview} centered size="md">
  <Modal.Header closeButton>
    <Modal.Title>Image Preview</Modal.Title>
  </Modal.Header>
  <Modal.Body className="text-center">
    {modalImageSrc && (
      <img
        src={modalImageSrc}
        alt="Preview"
        style={{
          maxWidth: "100%",
          maxHeight: "400px",
          objectFit: "contain",
        }}
      />
    )}
  </Modal.Body>
</Modal>

    </>
  );
};

export default AddProducts;
