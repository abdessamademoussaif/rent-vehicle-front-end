import { useState } from "react";
import { Button } from "./ui/button";
import Cookies from "js-cookie";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import ForgotPasswordRequestModal from "./ForgotPasswordRequestModal";
import VerifyResetCodeModal from "./VerifyResetCodeModal";
import ResetPasswordModal from "./ResetPasswordModal";

const LogButton = ({ setIsAuthenticated }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isVerifyResetCodeOpen, setIsVerifyResetCodeOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({ name: "", email: "", phone: "", password: "" });
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [forgotPasswordError, setForgotPasswordError] = useState("");

  const switchToForgotPassword = () => {
    setIsLoginOpen(false);  
    setIsForgotPasswordOpen(true);
  };
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const setCookies = (token, profileImg , userId , role) => {
    Cookies.set("authToken", token, { expires: 20, secure: true, sameSite: "Strict", path: "/" });
    Cookies.set("profileImg", profileImg, { expires: 20, secure: true, sameSite: "Strict", path: "/" });
    Cookies.set("userId", userId, { expires: 20, secure: true, sameSite: "Strict", path: "/" });

    Cookies.set("role", role, { expires: 20, secure: true, sameSite: "Strict", path: "/" });
  };
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      
      const data = await res.json();
      if (res.ok) {
        setCookies(data.token, data.data.profileImg, data.data._id, data.data.role);
        setIsLoginOpen(false);
        setLoginError("");
        setIsAuthenticated(true);
      } else {
        setLoginError(data.message || "Login failed.");
      }
    } catch (err) {
      setLoginError("An unexpected error occurred.");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...registerData, passwordConfirm: registerData.password }),
      });
      const data = await res.json();
      if (res.ok) {
        setCookies(data.token, data.data.profileImg, data.data._id, data.data.role);
        setIsRegisterOpen(false);
        setRegisterError("");
        setIsAuthenticated(true);
      } else {
        setRegisterError(data.message || "Registration failed.");
      }
    } catch (err) {
      setRegisterError("An unexpected error occurred.");
    }
  };

  const handleForgotPasswordSubmit = async (email) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/auth/forgotPassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setForgotPasswordEmail(email);
        setForgotPasswordError("");
        setIsForgotPasswordOpen(false);
        setIsVerifyResetCodeOpen(true);
      } else {
        setForgotPasswordError(data.message || "Request failed.");
      }
    } catch (err) {
      setForgotPasswordError("An unexpected error occurred.");
    }
  };

  const handleVerifyResetCodeSubmit = async (code) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/auth/verifyResetCode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetCode: code }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsVerifyResetCodeOpen(false);
        setForgotPasswordError("");
        setIsResetPasswordOpen(true);
      } else {
        setForgotPasswordError(data.message || "Verification failed.");
      }
    } catch (err) {
      setForgotPasswordError("An unexpected error occurred.");
    }
  };

  const handleResetPasswordSubmit = async (password) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/auth/resetPassword`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotPasswordEmail, newPassword: password }),
      });
      const data = await res.json();
      if (res.ok) {
        setForgotPasswordError("");
        setCookies(data.token, data.data.profileImg , data.data._id, data.data.role);
        setIsResetPasswordOpen(false);
        setIsLoginOpen(true);
        setIsAuthenticated(true);
      } else {
        setForgotPasswordError(data.message || "Password reset failed.");
      }
    } catch (err) {
      setForgotPasswordError("An unexpected error occurred.");
    }
  };

  return (
    <div>
      <Button className="text-white" onClick={() => setIsLoginOpen(true)}>Login</Button>

      {isLoginOpen && (
        <LoginModal
        loginData={loginData}
        onChange={handleLoginChange}
        onSubmit={handleLoginSubmit}
        onClose={() => setIsLoginOpen(false)}
        switchToRegister={() => { setIsLoginOpen(false); setIsRegisterOpen(true); }}
        error={loginError}
        switchToForgotPassword={switchToForgotPassword}  
      />
      )}

      {isRegisterOpen && (
        <RegisterModal
          registerData={registerData}
          onChange={handleRegisterChange}
          onSubmit={handleRegisterSubmit}
          onClose={() => setIsRegisterOpen(false)}
          switchToLogin={() => { setIsRegisterOpen(false); setIsLoginOpen(true); }}
          error={registerError}
        />
      )}

      {isForgotPasswordOpen && (
        <ForgotPasswordRequestModal
          onSubmit={handleForgotPasswordSubmit}
          onClose={() => setIsForgotPasswordOpen(false)}
          error={forgotPasswordError}
        />
      )}

      {isVerifyResetCodeOpen && (
        <VerifyResetCodeModal
          onSubmit={handleVerifyResetCodeSubmit}
          onClose={() => setIsVerifyResetCodeOpen(false)}
          error={forgotPasswordError}
        />
      )}

      {isResetPasswordOpen && (
        <ResetPasswordModal
          onSubmit={handleResetPasswordSubmit}
          onClose={() => setIsResetPasswordOpen(false)}
          error={forgotPasswordError}
        />
      )}
    </div>
  );
};

export default LogButton;
