import React, { useState } from "react";

const ResetPasswordModal = ({ onClose, onSubmit, error , loading }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleChangePassword = (e) => setNewPassword(e.target.value);
  const handleChangeConfirmPassword = (e) => setConfirmPassword(e.target.value);

  const validatePassword = (password) => {
    
    if (password.length < 4) {
      return "Password must be at least 4 characters long.";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordError(validatePassword(newPassword));

    if (newPassword === confirmPassword && !passwordError) {
      await onSubmit(newPassword);
    } else if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" aria-modal="true">
      <div className="bg-white dark:bg-gray-700 rounded-xl w-full max-w-md p-6 shadow-lg">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Reset Password</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <input
            type="password"
            placeholder="Enter new password"
            className="w-full p-2 border rounded-lg"
            value={newPassword}
            onChange={handleChangePassword}
            required
          />
          {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}

          <input
            type="password"
            placeholder="Confirm new password"
            className="w-full p-2 border rounded-lg"
            value={confirmPassword}
            onChange={handleChangeConfirmPassword}
            required
          />
          
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded-lg"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
