import {BrowserRouter,Routes,Route} from "react-router";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Home from "./pages/Admin/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Profile from "./pages/Private/Profile";
import PrivateRoute from "./components/PrivateRoutes";
import AdminRoute from "./components/AdminRoute";
import HomePage from "./pages/Public/HomePage";
import AdminMovies from "./pages/Admin/Movies";
import AdminMovieNew from "./pages/Admin/Movies/New";
import AdminMovieView from "./pages/Admin/Movies/View";
import AdminMovieEdit from "./pages/Admin/Movies/Edit";
import PublicMovieView from "./pages/Public/MovieView";
import AdminSessionNew from "./pages/Admin/Sessions/New";
import AdminRoomList from './pages/Admin/Rooms';
import AdminRoomNew from './pages/Admin/Rooms/New';
import AdminSessionEdit from './pages/Admin/Sessions/Edit';
import AdminUserList from "./pages/Admin/Users/List";
import SeatMap from "./pages/Private/SeatMap";
import TicketDetailPage from "./pages/Admin/Ticket/index.tsx"; 
import Scanner from "./pages/Admin/Scanner";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/movie/:movieId" element={<PublicMovieView />} />
        <Route path="/select-seat/:sessionId" element={<PrivateRoute><SeatMap /></PrivateRoute>} />
        <Route path="/meus-ingressos/:id" element={<PrivateRoute><TicketDetailPage /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/admin" element={<AdminRoute><Home /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUserList /></AdminRoute>} />
        <Route path="/admin/movies" element={<AdminRoute><AdminMovies /></AdminRoute>} />
        <Route path="/admin/movies/new" element={<AdminRoute><AdminMovieNew /></AdminRoute>} />
        <Route path="/admin/movies/view/:movieId" element={<AdminRoute><AdminMovieView /></AdminRoute>} />
        <Route path="/admin/movies/edit/:movieId" element={<AdminRoute><AdminMovieEdit /></AdminRoute>} />
        <Route path="/admin/sessions/new" element={<AdminRoute><AdminSessionNew /></AdminRoute>} />
        <Route path="/admin/sessions/edit/:sessionId" element={<AdminRoute><AdminSessionEdit /></AdminRoute>} />
        <Route path="/admin/rooms" element={<AdminRoute><AdminRoomList /></AdminRoute>} />
        <Route path="/admin/rooms/new" element={<AdminRoute><AdminRoomNew /></AdminRoute>} />
        <Route path="/admin/tickets/ticket/:id" element={<PrivateRoute><TicketDetailPage /></PrivateRoute>} />
        <Route path="/admin/scanner" element={<PrivateRoute><Scanner /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
