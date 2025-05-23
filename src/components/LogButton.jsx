import { useState } from "react";
import { Button } from "./ui/button";
import Cookies from "js-cookie";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import ForgotPasswordRequestModal from "./ForgotPasswordRequestModal";
import VerifyResetCodeModal from "./VerifyResetCodeModal";
import ResetPasswordModal from "./ResetPasswordModal";
import { useNavigate } from "react-router-dom";

const LogButton = ({ setIsAuthenticated, toHome }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isVerifyResetCodeOpen, setIsVerifyResetCodeOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [forgotPasswordError, setForgotPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const baseImg =
    "https://res.cloudinary.com/dsk3xnvyc/image/upload/v1747614291/blank-profile-picture-973460_1280_vgxfnu.png";
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

  const setCookies = (token, profileImg, userId, role) => {
    Cookies.set("authToken", token, {
      expires: 20,
      secure: true,
      sameSite: "Strict",
      path: "/",
    });
    if (!profileImg || profileImg == "") {
      Cookies.set("profileImg", baseImg, {
        expires: 20,
        secure: true,
        sameSite: "Strict",
        path: "/",
      });
    } else {
      Cookies.set("profileImg", profileImg, {
        expires: 20,
        secure: true,
        sameSite: "Strict",
        path: "/",
      });
    }
    Cookies.set("userId", userId, {
      expires: 20,
      secure: true,
      sameSite: "Strict",
      path: "/",
    });

    Cookies.set("role", role, {
      expires: 20,
      secure: true,
      sameSite: "Strict",
      path: "/",
    });
  };
  const handleLoginSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginData),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setCookies(
          data.token,
          data.data.profileImg,
          data.data._id,
          data.data.role
        );
        setIsLoginOpen(false);
        setLoginError("");
        setIsAuthenticated(true);
        toHome();
      } else {
        setLoginError(data.message || "Login failed.");
      }
    } catch (err) {
      setLoginError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...registerData,
            passwordConfirm: registerData.password,
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setCookies(
          data.token,
          data.data.profileImg,
          data.data._id,
          data.data.role
        );
        setIsRegisterOpen(false);
        setRegisterError("");
        setIsAuthenticated(true);
        toHome();
      } else {
        setRegisterError(data.message || "Registration failed.");
      }
    } catch (err) {
      setRegisterError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (email) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/auth/forgotPassword`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
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
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyResetCodeSubmit = async (code) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/auth/verifyResetCode`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resetCode: code }),
        }
      );
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
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (password) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/auth/resetPassword`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: forgotPasswordEmail,
            newPassword: password,
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setForgotPasswordError("");
        setCookies(
          data.token,
          data.data.profileImg,
          data.data._id,
          data.data.role
        );
        setIsResetPasswordOpen(false);
        setIsLoginOpen(true);
        setIsAuthenticated(true);
        toHome();
      } else {
        setForgotPasswordError(data.message || "Password reset failed.");
      }
    } catch (err) {
      setForgotPasswordError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button className="text-white" onClick={() => setIsLoginOpen(true)}>
        Login
      </Button>

      {isLoginOpen && (
        <LoginModal
          loginData={loginData}
          onChange={handleLoginChange}
          onSubmit={handleLoginSubmit}
          onClose={() => setIsLoginOpen(false)}
          switchToRegister={() => {
            setIsLoginOpen(false);
            setIsRegisterOpen(true);
          }}
          error={loginError}
          switchToForgotPassword={switchToForgotPassword}
          loading={loading}
        />
      )}

      {isRegisterOpen && (
        <RegisterModal
          registerData={registerData}
          onChange={handleRegisterChange}
          onSubmit={handleRegisterSubmit}
          onClose={() => setIsRegisterOpen(false)}
          switchToLogin={() => {
            setIsRegisterOpen(false);
            setIsLoginOpen(true);
          }}
          error={registerError}
          loading={loading}
        />
      )}

      {isForgotPasswordOpen && (
        <ForgotPasswordRequestModal
          onSubmit={handleForgotPasswordSubmit}
          onClose={() => setIsForgotPasswordOpen(false)}
          error={forgotPasswordError}
          loading={loading}
        />
      )}

      {isVerifyResetCodeOpen && (
        <VerifyResetCodeModal
          onSubmit={handleVerifyResetCodeSubmit}
          onClose={() => setIsVerifyResetCodeOpen(false)}
          error={forgotPasswordError}
          loading={loading}
        />
      )}

      {isResetPasswordOpen && (
        <ResetPasswordModal
          onSubmit={handleResetPasswordSubmit}
          onClose={() => setIsResetPasswordOpen(false)}
          error={forgotPasswordError}
          loading={loading}
        />
      )}
    </div>
  );
};

export default LogButton;
