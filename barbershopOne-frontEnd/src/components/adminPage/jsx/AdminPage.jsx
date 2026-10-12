import { useState } from "react"
import { useNavigate } from 'react-router-dom';
import "../css/AdminPage.css"
import { login } from "../../../api/admin";
import { logout } from "../../../api/admin";
import { toast } from "react-toastify";

function LoginForm({ onLogin, setUser }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const nav = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();
        setIsSubmitting(true);
        setErrorMessage("");

        try {
            const loginData = await login({ email, password }, setUser);
            if (loginData.status >= 300 || !loginData.body?.user) {
                throw new Error(loginData.body?.message || "Invalid email or password");
            }
            onLogin(loginData.body.user);
            nav("/");//navigate to home
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return <section className="login" aria-labelledby="admin-login-title">
        <p className="login-kicker">Staff access</p>
        <h1 id="admin-login-title">Welcome back</h1>
        <p className="login-description">Sign in to manage appointments and shop services.</p>

        <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="admin-email">Email address</label>
            <input
                id="admin-email"
                name="email"
                type="email"
                placeholder="yourEmail01@gmail.com"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
            />

            <label htmlFor="admin-password">Password</label>
            <input
                id="admin-password"
                name="password"
                type="password"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
            />

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
            {errorMessage && <p className="login-status" role="alert">{errorMessage}</p>}
        </form>
    </section>
}

function LoggedinUserInfo({ userInfo, onLogout }) {
    const displayName = userInfo.username || "Staff";
    const displayEmail = userInfo.email || "no email";
    const displayRole = userInfo.role || "user";

    return (
        <section className="user-info-logout" aria-labelledby="admin-user-card-title">
            <div className="user-info-card">
                <h2 id="admin-user-card-title">Welcome {displayName}</h2>

                <div className="user-info-list">
                    <div className="user-info-item">
                        <span className="user-info-label">EMAIL</span>
                        <span className="user-info-value">{displayEmail}</span>
                    </div>
                    <div className="user-info-item">
                        <span className="user-info-label">ROLE</span>
                        <span className="user-info-value">{displayRole}</span>
                    </div>
                </div>

                <button type="button" className="logout-button" onClick={onLogout}>
                    Log out
                </button>
            </div>
        </section>
    );
}

export function AdminPage({ user, setUser }) {
    const [newUser, setNewUser] = useState();
    const displayedUser = newUser === undefined ? user : newUser;

    const handleLogout = async () => {
        try {
            setNewUser(null);
            await logout(setUser);
            toast("SUCCESS: logout", { className: "successToast", progressClassName: "successProgress" });
        } catch (error) {
            toast(`ERROR: ${error.message}`, { className: "errorToast", progressClassName: "errorProgress" });
        }
    };

    return (
        <div className="admin-page">

            {!displayedUser ?
                <LoginForm onLogin={setNewUser} setUser={setUser} />
                :
                <LoggedinUserInfo userInfo={displayedUser} onLogout={handleLogout} />
            }
        </div>
    )
}

