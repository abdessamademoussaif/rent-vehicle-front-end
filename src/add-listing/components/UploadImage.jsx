import React, { useState } from "react";
import { IoIosClose } from "react-icons/io";

function UploadImage({ imagesFiles, setImagesFiles }) {
  const [selectedFileList, setSelectedFileList] = useState([]);

  const onFileSelected = (event) => {
    const files = Array.from(event.target.files); // Convert FileList to array
    const updatedList = [...selectedFileList, ...files];

    setSelectedFileList(updatedList); 
    setImagesFiles(updatedList);
  };

  const imageRemove = (imageToRemove) => {
    const updatedList = selectedFileList.filter(
      (item) => item !== imageToRemove
    );

    setSelectedFileList(updatedList);
    setImagesFiles(updatedList);
  };

  return (
    <div>
      <h2 className="font-medium text-lg my-3">Upload Vehicle Images</h2>
      <div className="grid grid-flow-col md:grid-cols-4 lg:grid-cols-6 gap-5 relative">
        {selectedFileList.map((image, index) => (
          <div key={index} className="relative">
            <IoIosClose
              className="absolute top-0 right-0 m-1 text-[23px] text-white bg-black rounded-full cursor-pointer"
              onClick={() => imageRemove(image)}
            />
            <img
              src={URL.createObjectURL(image)}
              alt="Selected"
              className="w-full h-[130px] object-cover rounded-xl"
            />
          </div>
        ))}
        <label htmlFor="upload-images">
          <div className="border rounded-xl border-dotted border-primary bg-blue-100 p-10 cursor-pointer hover:shadow-lg transition-all duration-200 ease-in-out h-[130px] flex justify-center items-center">
            <h2 className="text-3xl text-primary">+</h2>
          </div>
        </label>
        <input
          type="file"
          multiple
          id="upload-images"
          className="hidden"
          onChange={onFileSelected}
        />
      </div>
    </div>
  );
}

export default UploadImage;
