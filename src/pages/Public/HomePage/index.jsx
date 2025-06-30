import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import api from '../../../services/api';
import Slider from "react-slick";
import CineHugoLogo from "../../../assets/cinehugo.svg";
import { TicketIcon, EyeIcon } from '@heroicons/react/24/outline';

const getImageUrl = (imagePath) => {
    if (!imagePath) return `https://placehold.co/300x450?text=No+Image`;
    let cleanedPath = imagePath.startsWith('undefined/') ? imagePath.substring(10) : imagePath;
    const baseUrl = api.defaults.baseURL.endsWith('/') ? api.defaults.baseURL : `${api.defaults.baseURL}/`;
    return `${baseUrl}${cleanedPath}`;
};

function HomePage() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const { data } = await api.get('/movies');
        setMovies(data);
      } catch (error) {
        console.error("Falha ao buscar filmes:", error);
      }
    }
    fetchMovies();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    autoplay: true,
    autoplaySpeed: 5000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 3 } },
      { breakpoint: 600, settings: { slidesToShow: 2, slidesToScroll: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } }
    ]
  };

  const handleBuyTicket = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success('Funcionalidade de compra a ser implementada!');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <header className="bg-gradient-to-r from-red-600 to-red-800 dark:from-red-900 dark:to-red-950 text-white shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center space-x-2">
              <img className="w-8 h-8 mr-2" src={CineHugoLogo} alt="logo" />
              <span className="text-3xl font-bold tracking-tight">CineHugo</span>
            </Link>
            <nav className="flex items-center space-x-4">
              <Link to="/login" className="flex items-center text-lg px-4 py-2 rounded-md hover:bg-red-700 dark:hover:bg-red-800 transition">Login</Link>
              <Link to="/register" className="text-lg bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-950">Register</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-extrabold text-center mb-12 text-red-700 dark:text-white">Em Cartaz</h1>
        <Slider {...settings}>
          {movies.map((movie) => (
            <div key={movie._id} className="p-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden group">
                <div className="relative">
                  <img
                    src={getImageUrl(movie.mainImageUrl)}
                    alt={`Pôster de ${movie.title}`}
                    className="w-full h-auto object-cover aspect-[2/3] transition-transform duration-300 group-hover:blur-sm"
                  />
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Link to={`/movie/${movie.id}`} className="flex items-center gap-2 bg-white/80 text-black font-bold py-2 px-6 rounded-lg hover:bg-white">
                        <EyeIcon className="h-5 w-5"/> Ver Detalhes
                    </Link>
                    <button onClick={handleBuyTicket} className="flex items-center gap-2 bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700">
                        <TicketIcon className="h-5 w-5"/> Comprar Ingresso
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-1 truncate">{movie.title}</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{movie.genre}</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </main>

      <footer className="bg-gray-800 dark:bg-gray-950 text-gray-400 py-8 mt-16 text-center">
        <p>&copy; {new Date().getFullYear()} CineHugo.</p>
      </footer>
    </div>
  );
}

export default HomePage;