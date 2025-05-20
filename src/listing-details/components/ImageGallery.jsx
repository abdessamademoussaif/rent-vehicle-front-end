import React, { useEffect, useState, useMemo } from "react";

function ImageGallery({ imagesUrl = [], cover }) {
  const imageList = useMemo(() => {
    // Ensure cover is included and avoid duplicates
    const uniqueImages = new Set(imagesUrl);
    if (cover) uniqueImages.add(cover);
    return Array.from(uniqueImages);
  }, [imagesUrl, cover]);

  const [selectedImage, setSelectedImage] = useState(() => imageList[0]);

  useEffect(() => {
    if (!selectedImage && imageList.length > 0) {
      setSelectedImage(imageList[0]);
    }
  }, [imageList, selectedImage]);

  if (!imageList.length) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center border rounded-xl bg-gray-100 text-gray-400">
        No images available
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Main Image */}
      <div className="w-full h-[500px] mb-4">
        <img
          src={selectedImage}
          alt="Selected"
          className="w-full h-full object-cover rounded-xl transition duration-300"
        />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {imageList?.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`Thumbnail ${index}`}
            onClick={() => setSelectedImage(url)}
            className={`h-24 w-32 object-cover rounded-[5px] cursor-pointer border-2 transition duration-200 ${
              selectedImage === url ? "border-blue-500" : "border-transparent"
            }`}
          />        ))}
      </div>
    </div>
  );
}

export default ImageGallery;
