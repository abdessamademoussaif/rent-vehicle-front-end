import React from "react";

const RegisterModal = ({
  registerData,
  onChange,
  onSubmit,
  onClose,
  switchToLogin,
  error,
  loading,
}) => {
  const handleGoogleRegister = () => {
    window.location.href = `${
      import.meta.env.VITE_BASE_URL
    }/api/v1/auth/google`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-gray-700 rounded-xl w-full max-w-md p-6 shadow-lg">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Create Account
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full p-2 border rounded-lg"
            value={registerData.name}
            onChange={onChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 border rounded-lg"
            value={registerData.email}
            onChange={onChange}
            required
          />
          <input
            type="phone"
            name="phone"
            placeholder="Phone"
            className="w-full p-2 border rounded-lg"
            value={registerData.phone}
            onChange={onChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-2 border rounded-lg"
            value={registerData.password}
            onChange={onChange}
            required
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded-lg"
          >
            {loading ? "loading..." : "Register"}
          </button>

          <div className="relative text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative bg-white dark:bg-gray-700 px-4 text-gray-500 text-sm">
              or
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleRegister}
            className="w-full flex items-center justify-center border border-gray-300 rounded-lg py-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            Continue with Google
          </button>

          <p className="text-sm text-gray-500 text-center">
            Already have an account?{" "}
            <button
              type="button"
              onClick={switchToLogin}
              className="text-blue-600 underline"
            >
              Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;
