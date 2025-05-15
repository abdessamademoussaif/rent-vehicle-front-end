const LoginModal = ({
  loginData,
  onChange,
  onSubmit,
  onClose,
  switchToRegister,
  error,
  switchToForgotPassword,
}) => {
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_BASE_URL}/api/v1/auth/google`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-gray-700 rounded-xl w-full max-w-md p-6 shadow-lg">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Sign in
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
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 border rounded-lg"
            value={loginData.email}
            onChange={onChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-2 border rounded-lg"
            value={loginData.password}
            onChange={onChange}
            required
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded-lg"
          >
            Login
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
            onClick={handleGoogleLogin}
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
            Not registered?{" "}
            <button
              type="button"
              onClick={switchToRegister}
              className="text-blue-600 underline"
            >
              Create account
            </button>
          </p>

          <div className="mt-4 text-sm text-center">
            <button
              type="button"
              onClick={switchToForgotPassword} 
              className="text-blue-600 underline"
            >
              Forgot Password?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
