import { useState } from "react";

const ForgotPasswordRequestModal = ({ onSubmit, onClose, error }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return alert("Please enter a valid email address.");
    }
    
    setIsLoading(true);
    await onSubmit(email); 
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-700 rounded-xl w-full max-w-md p-6 shadow-lg">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Forgot Password
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="w-full p-2 border rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded-lg"
            disabled={isLoading}  // Disable button when loading
          >
            {isLoading ? "Processing..." : "Request Reset"}
          </button>
        </form>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
};

export default ForgotPasswordRequestModal;
