import { useEffect } from "react";
import { useNavigate } from "react-router-dom"

const withAuth = (WrappedComponent) => {
    const AuthComponent = (props) => {
        const navigate = useNavigate();

        const isAuthenticated = () => {
            return !!localStorage.getItem("token");
        };

        useEffect(() => {
            if (!isAuthenticated()) {
                navigate("/auth");
            }
        }, [navigate]);

        if (!isAuthenticated()) {
            return  <div className="loading">Redirecting...</div>
        }

        return <WrappedComponent {...props} />;
    }

    return AuthComponent;
}

export default withAuth;