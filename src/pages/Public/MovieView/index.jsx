import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import api from '../../../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { ArrowLeftIcon, CalendarDaysIcon, TagIcon, TicketIcon } from '@heroicons/react/24/outline';

const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  let cleanedPath = imagePath.startsWith('undefined/') ? imagePath.substring(10) : imagePath;
  const baseUrl = api.defaults.baseURL.endsWith('/') ? api.defaults.baseURL : `${api.defaults.baseURL}/`;
  return `${baseUrl}${cleanedPath}`;
};

function PublicMovieView() {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const { movieId } = useParams();

  useEffect(() => {
    if (!movieId) return;
    async function fetchMovie() {
      try {
        setLoading(true);
        const { data } = await api.get(`/movies/movie/${movieId}`);
        setMovie(data);
      } catch (error) {
        toast.error('Filme não encontrado ou falha ao carregar.');
        console.error("Erro ao buscar filme:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMovie();
  }, [movieId]);

  const handleBuyTicket = () => {
    toast.success('Funcionalidade de compra a ser implementada!');
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white"><p>Carregando...</p></div>;
  if (!movie) return <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white"><Toaster /><p>Filme não encontrado.</p></div>;

  const bannerSrc = getImageUrl(movie.bannerImageUrl) || 'https://via.placeholder.com/1280x720?text=Banner';
  const posterSrc = getImageUrl(movie.mainImageUrl) || 'https://via.placeholder.com/300x450?text=Pôster';

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Toaster position="top-right" />
      <div className="relative h-64 md:h-96 w-full">
        <img src={bannerSrc} alt={`Banner de ${movie.title}`} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
        <div className="absolute top-4 left-4">
          <Link
            to="/"
            className="flex items-center gap-2 bg-black/50 hover:bg-black/70 text-white font-bold py-2 px-4 rounded-full transition duration-300 backdrop-blur-sm"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Voltar para a Home
          </Link>
        </div>
      </div>
      <div className="container mx-auto p-4 md:p-8 -mt-24 md:-mt-32 relative">
        <div className="md:flex md:space-x-8">
          <div className="w-full md:w-1/3 flex-shrink-0">
            <img src={posterSrc} alt={`Pôster de ${movie.title}`} className="rounded-xl shadow-2xl w-full" />
            <button
              onClick={handleBuyTicket}
              className="w-full mt-6 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-4 rounded-lg transition duration-150 text-lg"
            >
              <TicketIcon className="h-6 w-6 mr-2" />
              Comprar Ingresso
            </button>
          </div>
          <div className="w-full md:w-2/3 mt-6 md:mt-0">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">{movie.title}</h1>
            <div className="flex flex-wrap items-center gap-4 mb-6 text-gray-300">
                <div className="flex items-center gap-2"><TagIcon className="h-5 w-5" /><span>{movie.genre || 'N/A'}</span></div>
                <div className="flex items-center gap-2"><CalendarDaysIcon className="h-5 w-5" /><span>{new Date(movie.releaseDate).toLocaleDateString('pt-BR')}</span></div>
            </div>
            <div>
                <h2 className="text-2xl font-bold mb-2 text-red-500">Sinopse</h2>
                <p className="text-gray-300 leading-relaxed">{movie.synopsis || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublicMovieView;