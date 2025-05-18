import React, { useState } from "react";

const VerifyResetCodeModal = ({ onClose, onSubmit, error , loading }) => {
  const [resetCode, setResetCode] = useState("");

  const handleChange = (e) => setResetCode(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(resetCode);  
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" aria-modal="true">
      <div className="bg-white dark:bg-gray-700 rounded-xl w-full max-w-md p-6 shadow-lg">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Verify Reset Code</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <input
            type="text"
            placeholder="Enter your reset code"
            className="w-full p-2 border rounded-lg"
            value={resetCode}
            onChange={handleChange}
            required
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded-lg"
            disabled={loading}  
          >
            {loading ? "Verifying..." : "Verify Code"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyResetCodeModal;
