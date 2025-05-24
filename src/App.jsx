import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
