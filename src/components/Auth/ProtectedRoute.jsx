import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ isLoggedIn, children }) {
  if (!isLoggedIn) {
    return <Navigate to="/signin" replace />;
  }

  return children ? children : <Outlet />;
}
