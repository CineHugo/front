import { Navigate } from "react-router";
import Cookies from "js-cookie";

function PrivateRoute({ children }) {
  const token = Cookies.get("token");
  const userData = Cookies.get("user");

  const isAuthenticated = token && userData && userData !== "undefined";

  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
