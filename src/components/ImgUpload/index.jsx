import { useState, useRef, useCallback, useEffect } from "react";
import { FaUpload, FaTimes, FaLink, FaImage } from "react-icons/fa";
import { generateUniqueFilename } from "../../services/api/uploadService";
import { toast } from "react-toastify";

/**
 * Component upload ảnh với các tính năng:
 * - Drag & drop file
 * - Chọn file từ máy tính
 * - Nhập URL ảnh trực tiếp
 * - Upload trực tiếp lên Cloudflare R2
 */
const ImageUpload = ({ value, onChange, onError, token, onFileSelect }) => {
  const [imageUrl, setImageUrl] = useState(value || "");
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadMode, setUploadMode] = useState("file"); // 'file' | 'url'
  const fileInputRef = useRef(null);
  const urlInputRef = useRef(null);

  // Cập nhật khi value prop thay đổi
  useEffect(() => {
    if (value !== undefined) {
      setImageUrl(value || "");
    }
  }, [value]);

  // Xử lý drag events
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // Xử lý drop file
  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFileUpload(e.dataTransfer.files[0]);
    }
  }, []);

  // Xử lý chọn file từ input
  const handleFileSelect = useCallback(async (e) => {
    if (e.target.files && e.target.files[0]) {
      await handleFileUpload(e.target.files[0]);
    }
  }, []);

  // Xử lý file đã chọn: chỉ stage file, KHÔNG upload ngay
  const handleFileUpload = async (file) => {
    // Kiểm tra loại file
    if (!file.type.startsWith("image/")) {
      const msg = "File không phải là ảnh";
      if (typeof onError === "function") onError(msg);
      return;
    }

    // Kiểm tra kích thước file (tối đa 10MB)
    if (file.size > 10 * 1024 * 1024) {
      const msg = "Kích thước file không được vượt quá 10MB";
      if (typeof onError === "function") onError(msg);
      return;
    }

    // Tạo preview và filename, nhưng KHÔNG upload — upload sẽ được thực hiện khi user nhấn Lưu
    const filename = generateUniqueFilename(file);
    const previewUrl = URL.createObjectURL(file);
    setImageUrl(previewUrl);

    // Thông báo parent rằng có file được chọn (parent sẽ upload khi user lưu)
    if (typeof onFileSelect === "function") {
      onFileSelect(file, filename);
    }
    // Nếu parent chỉ chờ URL string, cũng gọi onChange với preview URL để hiển thị
    if (onChange) onChange(previewUrl);
  };

  // Xử lý nhập URL
  const handleUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    if (onChange) onChange(url);
  };

  // Xử lý xóa ảnh
  const handleRemove = () => {
    setImageUrl("");
    if (onChange) onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (urlInputRef.current) {
      urlInputRef.current.value = "";
    }
    if (typeof onFileSelect === "function") {
      onFileSelect(null);
    }
  };

  // Xử lý click vào vùng upload
  const handleClick = () => {
    if (uploadMode === "file" && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      {/* Tabs để chuyển đổi giữa upload file và nhập URL */}
      <div className="flex gap-2 mb-4 border-b border-gray-200">
        <button
          type="button"
          onClick={() => {
            setUploadMode("file");
            setImageUrl("");
            if (onChange) onChange("");
          }}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            uploadMode === "file"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <FaUpload className="inline mr-2" />
          Upload File
        </button>
        <button
          type="button"
          onClick={() => {
            setUploadMode("url");
            setImageUrl("");
            if (onChange) onChange("");
          }}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            uploadMode === "url"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <FaLink className="inline mr-2" />
          Nhập URL
        </button>
      </div>

      {/* Upload File Mode */}
      {uploadMode === "file" && (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
            dragActive
              ? "border-indigo-500 bg-indigo-50"
              : "border-gray-300 hover:border-indigo-400"
          } ${uploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />

          <div className="text-center">
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-sm text-gray-600">Đang upload...</p>
              </>
            ) : (
              <>
                <FaImage className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-semibold text-indigo-600">
                    Click để chọn
                  </span>{" "}
                  hoặc{" "}
                  <span className="font-semibold text-indigo-600">kéo thả</span>{" "}
                  ảnh vào đây
                </p>
                <p className="text-xs text-gray-500">
                  Hỗ trợ: JPG, PNG, GIF, WEBP (tối đa 10MB)
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Nhập URL Mode */}
      {uploadMode === "url" && (
        <div>
          <div className="relative">
            <FaLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              ref={urlInputRef}
              type="text"
              value={imageUrl}
              onChange={handleUrlChange}
              placeholder="Nhập URL ảnh (ví dụ: https://example.com/image.jpg)"
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
            {imageUrl && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Preview ảnh */}
      {imageUrl && (
        <div className="mt-4 relative inline-block">
          <img
            src={imageUrl}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200 shadow-md"
            onError={(e) => {
              e.target.src = "/images/Product/placeholder.jpg";
              if (onError) onError("Không thể tải ảnh từ URL này");
            }}
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            title="Xóa ảnh"
          >
            <FaTimes className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
