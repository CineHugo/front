import { Navigate } from "react-router";

function PrivateRoute({ children }) {
  const isAuthenticated = !!localStorage.getItem("token");

  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
