import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppStore } from "../../state/useAppStore";
import {
  LuMail,
  LuLock,
  LuEye,
  LuEyeOff,
  LuLoader,
} from "react-icons/lu";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const profile = useAppStore((s) => s.extractedProfile) || {};
  const setProfile = (p) => useAppStore.setState({ extractedProfile: p });

  const [form, setForm] = useState({
    email: profile.email || "",
    password: "",
    remember: true,
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    setErr("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!form.email || !form.password) {
      setErr("Please provide both email and password.");
      return;
    }
    try {
      setLoading(true);
      // Fake delay to show loading UI; plug in your auth call here
      await new Promise((r) => setTimeout(r, 800));

      // If you get a user back from your auth provider, persist it:
      setProfile({
        ...profile,
        email: form.email,
        // You might store tokens/flags in a proper auth store instead:
        isLoggedIn: true,
      });

      // Optional: respect "remember me" with localStorage
      if (form.remember) {
        localStorage.setItem("rememberEmail", form.email);
      } else {
        localStorage.removeItem("rememberEmail");
      }

      navigate("/account");
    } catch (e2) {

      setErr("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = () => {
    // Hook your OAuth flow here
    // For now, just simulate success:
    setLoading(true);
    setTimeout(() => {
      setProfile({ ...profile, isLoggedIn: true });
      navigate("/account");
    }, 700);
  };

  return (
    <section className="loginx-wrap">
      <div className="loginx-bg" />
      <div className="loginx-card">
        <div className="loginx-head">
          <div className="loginx-logo">◎</div>
          <div>
            <h2>Welcome back</h2>
            <p className="loginx-sub">
              Log in to manage your profile and applications.
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="loginx-form" noValidate>
          {err ? <div className="loginx-error">{err}</div> : null}

          <label className="loginx-field">
            <span className="loginx-label">Email</span>
            <div className="loginx-inp">
              <LuMail className="loginx-ico" />
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={onChange}
                autoComplete="email"
                required
              />
            </div>
          </label>

          <label className="loginx-field">
            <span className="loginx-label">Password</span>
            <div className="loginx-inp">
              <LuLock className="loginx-ico" />
              <input
                name="password"
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={onChange}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="loginx-eye"
                onClick={() => setShowPw((s) => !s)}
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? <LuEyeOff /> : <LuEye />}
              </button>
            </div>
          </label>

          <div className="loginx-row">
            <label className="loginx-check">
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={onChange}
              />
              <span>Remember me</span>
            </label>

            <Link to="/forgot" className="loginx-forgot">
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="loginx-btn loginx-btn--primary" disabled={loading}>
            {loading ? <LuLoader className="loginx-spin" /> : "Log In"}
          </button>

          <div className="loginx-div">
            <span>OR</span>
          </div>

          <button
            type="button"
            className="loginx-btn loginx-btn--google"
            onClick={onGoogle}
            disabled={loading}
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
            />
            Continue with Google
          </button>

          <p className="loginx-meta">
            Don’t have an account?{" "}
            <Link to="/signup" className="loginx-link">Create one</Link>
          </p>
        </form>
      </div>
    </section>
  );
}
