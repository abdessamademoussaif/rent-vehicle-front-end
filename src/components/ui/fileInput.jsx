import React, { useState, useRef } from 'react';
import { Upload, X, Image } from 'lucide-react';

const FileInput = ({
  label,
  onChange,
  accept = 'image/*',
  error,
  helperText,
  value,
  showPreview = true,
}) => {
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    onChange(file);

    if (file && showPreview) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleClear = () => {
    onChange(null);
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <div className="flex flex-col space-y-2">
        <div
          className={`
            border-2 border-dashed rounded-[10px] p-4
            ${error ? 'border-red-400' : 'border-gray-300 hover:border-gray-400'}
            transition-colors duration-200
            ${preview ? 'bg-gray-50' : ''}
            flex flex-col items-center justify-center cursor-pointer
          `}
          onClick={() => inputRef.current?.click()}
        >
          <input
            type="file"
            className="hidden"
            ref={inputRef}
            onChange={handleFileChange}
            accept={accept}
          />

          {preview ? (
            <div className="relative w-full">
              <img
                src={preview}
                alt="File preview"
                className="max-h-48 mx-auto rounded object-contain"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="absolute top-1 right-1 p-1 bg-gray-800 bg-opacity-70 rounded-full text-white hover:bg-opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="text-center py-6 px-4">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-900">
                  Click to upload a file
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {accept.includes('image')
                    ? 'PNG, JPG, GIF up to 10MB'
                    : 'Upload a file'}
                </p>
              </div>
            </div>
          )}
        </div>

        {(error || helperText) && (
          <p className={`text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
            {error || helperText}
          </p>
        )}

        {value && !preview && (
          <div className="flex items-center space-x-2">
            <Image size={16} className="text-gray-500" />
            <span className="text-sm text-gray-700 truncate">{value.name}</span>
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileInput;
