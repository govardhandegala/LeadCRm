import React, { useEffect, useState } from "react";
import "./products.css";
import { Modal } from "react-bootstrap";
import { message, Spin } from "antd";
import { AiOutlineEye, AiOutlineDownload, AiOutlineDelete } from "react-icons/ai";
import { MdOutlineFileUpload } from "react-icons/md";
import Instance from "../../AxiosConfig";

const AddProducts = ({ show, handleClose, fetchProducts }) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState(null);

  const addProducts = async () => {
    try {
      setLoading(true);
      const response = await Instance.post("/products", {
        title,
        price: Number(price),
        description,
        category,
        image: imageUrl,
      });
       console.log("addig product",response);
       
      if (response.status === 200 || response.status === 201) {
        message.success("New Product added successfully!");
        handleClose();

        setTitle("");
        setPrice("");
        setCategory("");
        setDescription("");
        setUploadedFiles([]);
        setImageUrl(null);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      message.error("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      addFiles(files);
      setImageUrl(URL.createObjectURL(files[0]));
    }
  };

  const addFiles = (files) => {
    const newFiles = files.map((file) => ({
      name: file.name,
      size: (file.size / 1024).toFixed(1) + " Kb",
      date: new Date().toLocaleDateString(),
      file: file,
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleClosePreview = () => {
    if (modalImageSrc) URL.revokeObjectURL(modalImageSrc);
    setShowModal(false);
    setModalImageSrc(null);
  };

  return (
    <>
      {/* MAIN ADD PRODUCT MODAL */}
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        centered
        backdrop="static"
        dialogClassName="custom-agent-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Product</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form>
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-12 mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="form-control"
                    placeholder="Enter title"
                  />
                </div>

                <div className="col-md-12 mb-3">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="form-control"
                    placeholder="Enter price"
                  />
                </div>

                <div className="col-lg-12 mt-3">
                  <label className="input-label form-label">Description</label>
                  <textarea
                    className="input-placeholder form-control"
                    placeholder="Description..."
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="col-md-12 mb-3">
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="form-control"
                    placeholder="Enter category"
                  />
                </div>

                <div className="attachment-upload mt-4">
                  <label className="input-label form-label">Image</label>
                  <div
                    className="upload-box"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                  >
                    <input
                      id="fileInput"
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                    <p
                      className="upload-text"
                      onClick={() => document.getElementById("fileInput").click()}
                    >
                      Drag and Drop Attachment here or{" "}
                      <span className="upload-link">click to Upload</span>{" "}
                      <span className="upload-icon">
                        <MdOutlineFileUpload />
                      </span>
                    </p>
                  </div>
                </div>

                {/* FILE DETAILS TABLE */}
                {uploadedFiles.length > 0 && (
                  <div className="table-responsive">
                    <table className="file-table">
                      <thead>
                        <tr>
                          <th>File Name</th>
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
                            <td className="file-actions">
                              {/* VIEW FILE */}
                              <AiOutlineEye
                                className="action-icon"
                                onClick={() => {
                                  const fileURL = URL.createObjectURL(file.file);
                                  setModalImageSrc(fileURL);
                                  setShowModal(true);
                                }}
                              />
                              {/* DOWNLOAD FILE */}
                              <AiOutlineDownload
                                className="action-icon"
                                onClick={() => {
                                  const url = URL.createObjectURL(file.file);
                                  const link = document.createElement("a");
                                  link.href = url;
                                  link.download = file.name;
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                  URL.revokeObjectURL(url);
                                }}
                              />
                              {/* DELETE FILE */}
                              <AiOutlineDelete
                                className="action-icon"
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
                  </div>
                )}

                <div className="d-flex justify-content-end gap-2 mt-3">
                  <button
                    type="button"
                    className="discard-btn"
                    onClick={handleClose}
                  >
                    Discard
                  </button>
                  <button
                    type="button"
                    className="save-btn d-flex align-items-center justify-content-center"
                    onClick={addProducts}
                    disabled={loading}
                    style={{ minWidth: "100px" }}
                  >
                    {loading ? (
                      <>
                        <Spin size="small" /> &nbsp;Saving...
                      </>
                    ) : (
                      "Save"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* IMAGE PREVIEW MODAL */}
      <Modal show={showModal} onHide={handleClosePreview} centered size="md">
        <Modal.Header closeButton>
          <Modal.Title>Image Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {modalImageSrc && (
            <img
              src={modalImageSrc}
              alt="Preview"
              style={{ maxWidth: "100%", maxHeight: "400px", objectFit: "contain" }}
            />
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddProducts;
