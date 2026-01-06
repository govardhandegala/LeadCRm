import React, { useEffect, useState } from "react";
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

const EditProduct = ({ show, handleClose, productData, fetchProducts }) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [imageUrl, setImageUrl] = useState(null); // ✅ Added state for image URL
  const [modalImageSrc, setModalImageSrc] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Autofill product data + push existing image
  useEffect(() => {
    if (productData) {
      setTitle(productData.title || "");
      setPrice(productData.price || "");
      setDescription(productData.description || "");
      setCategory(productData.category || "");
      setImageUrl(productData.image || null);

      if (productData.image) {
        setUploadedFiles([
          {
            name: "Existing Image",
            size: "-",
            date: "-",
            file: null,
            url: productData.image,
          },
        ]);
      }
    }
  }, [productData]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map((file) => ({
      name: file.name,
      size: (file.size / 1024).toFixed(1) + " Kb",
      date: new Date().toLocaleDateString(),
      file: file,
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);

    // Update imageUrl for API request (use first uploaded file)
    if (files.length > 0) {
      setImageUrl(URL.createObjectURL(files[0]));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleFileChange({ target: { files } });
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleClosePreview = () => {
    if (modalImageSrc && !modalImageSrc.startsWith("http")) {
      URL.revokeObjectURL(modalImageSrc);
    }
    setModalImageSrc(null);
    setShowModal(false);
  };

  const handleDownload = async (file) => {
    try {
      message.loading({ content: "Downloading file...", key: "download" });

      let blob;

      if (file.file) {
        // Local uploaded file
        blob = file.file;
      } else {
        // Remote image (API image)
        const response = await fetch(file.url);
        blob = await response.blob();
      }

      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = blobUrl;
      link.download = file.name || "image";
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

      message.success({ content: "Download started ✅", key: "download" });
    } catch (err) {
      console.error(err);
      message.error("Failed to download file ❌");
    }
  };

  const updateProduct = async () => {
    if (!productData?.id) return message.error("Product ID missing");

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("category", category);

      // Only append the file if a new file is uploaded
      const file = uploadedFiles.find((f) => f.file)?.file;
      if (file) {
        formData.append("image", file); // backend expects "image" field
      }

      const response = await Instance.put(
        `/products/${productData.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("product edited",response)
      if (response.status === 200 || response.status === 201) {
        message.success("Product updated successfully!");
        handleClose();
        fetchProducts();
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to update product details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* MAIN EDIT PRODUCT MODAL */}
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        centered
        backdrop="static"
        dialogClassName="custom-agent-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
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
                  />
                </div>

                <div className="col-md-12 mb-3">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="form-control"
                  />
                </div>

                <div className="col-lg-12 mt-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
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
                  />
                </div>

                {/* IMAGE UPLOAD */}
                <div className="attachment-upload mt-4">
                  <label className="form-label">Image</label>
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
                      onClick={() =>
                        document.getElementById("fileInput").click()
                      }
                    >
                      Drag and Drop Attachment here or{" "}
                      <span className="upload-link">click to Upload</span>{" "}
                      <MdOutlineFileUpload />
                    </p>
                  </div>
                </div>

                {/* FILE TABLE */}
                {uploadedFiles.length > 0 && (
                  <div className="table-responsive mt-3">
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
                              {/* VIEW IMAGE */}
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

                              {/* DOWNLOAD IMAGE */}
                              <AiOutlineDownload
                                className="action-icon"
                                onClick={() => handleDownload(file)}
                              />

                              {/* DELETE IMAGE */}
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
                    className="save-btn"
                    disabled={loading}
                    onClick={updateProduct}
                  >
                    {loading ? <Spin size="small" /> : "Save"}
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

export default EditProduct;
