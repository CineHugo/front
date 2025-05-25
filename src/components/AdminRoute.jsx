import { Navigate } from "react-router";
import Cookies from "js-cookie";

function AdminRoute({ children }) {
  const token = Cookies.get('token');
  const userData = Cookies.get('user');
  
  if (!token || !userData || userData === 'undefined') {
    return <Navigate to="/login" />;
  }
  
  try {
    const user = JSON.parse(userData);
    if (user.role !== 'admin') {
      return <Navigate to="/profile" />;
    }
    return children;
  } catch (error) {
    return <Navigate to="/login" />;
  }
}

export default AdminRoute;
