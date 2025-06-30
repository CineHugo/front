import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoutes";
import AdminRoute from "./components/AdminRoute";
import HomePage from "./pages/HomePage";
import AdminMovies from "./pages/Movies";
import AdminMovieNew from "./pages/Movies/New";
import AdminMovieView from "./pages/Movies/View";
import AdminMovieEdit from "./pages/Movies/Edit";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/profile" 
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <Home />
            </AdminRoute>
          } 
        />
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } 
        />
        <Route
          path="/admin/movies"
          element={
            <AdminRoute>
              <AdminMovies />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/movies/new"
          element={
            <AdminRoute>
              <AdminMovieNew />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/movies/view/:movieId"
          element={
            <AdminRoute>
              <AdminMovieView />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/movies/edit/:movieId"
          element={
            <AdminRoute>
              <AdminMovieEdit />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
