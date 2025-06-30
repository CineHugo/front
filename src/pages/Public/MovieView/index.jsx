import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import api from '../../../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { ArrowLeftIcon, CalendarDaysIcon, TagIcon, TicketIcon, UsersIcon } from '@heroicons/react/24/outline';

const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  let cleanedPath = imagePath.startsWith('undefined/') ? imagePath.substring(10) : imagePath;
  const baseUrl = api.defaults.baseURL.endsWith('/') ? api.defaults.baseURL : `${api.defaults.baseURL}/`;
  return `${baseUrl}${cleanedPath}`;
};

function PublicMovieView() {
  const [movie, setMovie] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { movieId } = useParams();

  useEffect(() => {
    if (!movieId) return;
    async function fetchData() {
      try {
        setLoading(true);
        const [movieRes, sessionsRes, roomsRes] = await Promise.all([
          api.get(`/movies/movie/${movieId}`),
          api.get('/sessions'),
          api.get('/rooms')
        ]);

        const movieData = movieRes.data;
        const allSessions = sessionsRes.data;
        const allRooms = roomsRes.data;

        // Filtra as sessões para este filme
        const movieSessions = allSessions.filter(s => s.movieId === movieData.id);

        // Mapeia as sessões para incluir o nome da sala e capacidade
        const sessionsWithDetails = movieSessions.map(session => {
            const room = allRooms.find(r => r._id === session.roomId);
            return {
                ...session,
                roomName: room ? room.name : 'Sala desconhecida',
                // A API precisa retornar as vagas restantes. Por agora, usamos a capacidade total.
                availableSeats: room ? room.capacity : 0, 
            };
        });
        
        setMovie(movieData);
        setSessions(sessionsWithDetails);

      } catch (error) {
        toast.error('Filme não encontrado ou falha ao carregar.');
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [movieId]);

  const handleBuyTicket = () => {
    toast.success('Funcionalidade de compra a ser implementada!');
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white"><p>Carregando...</p></div>;
  if (!movie) return <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white"><Toaster /><p>Filme não encontrado.</p></div>;

  const bannerSrc = getImageUrl(movie.bannerImageUrl) || 'https://via.placeholder.com/1280x720?text=Banner';
  const posterSrc = getImageUrl(movie.mainImageUrl) || 'https://via.placeholder.com/300x450?text=Pôster';

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-16">
      <Toaster position="top-right" />
      <div className="relative h-64 md:h-96 w-full">
        <img src={bannerSrc} alt={`Banner de ${movie.title}`} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
        <div className="absolute top-4 left-4 z-10">
          <Link to="/" className="flex items-center gap-2 bg-black/50 hover:bg-black/70 font-bold py-2 px-4 rounded-full transition duration-300 backdrop-blur-sm">
            <ArrowLeftIcon className="h-5 w-5" /> Voltar
          </Link>
        </div>
      </div>

      <div className="container mx-auto p-4 md:p-8 -mt-24 md:-mt-32 relative">
        <div className="md:flex md:space-x-8">
          <div className="w-full md:w-1/3 flex-shrink-0">
            <img src={posterSrc} alt={`Pôster de ${movie.title}`} className="rounded-xl shadow-2xl w-full" />
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

        {/* Seção de Sessões */}
        <div className="mt-12">
            <h2 className="text-3xl font-bold mb-6">Sessões Disponíveis</h2>
            <div className="space-y-4">
                {sessions.length > 0 ? sessions.map(session => (
                    <div key={session.id} className="bg-gray-800 rounded-lg p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex-1">
                            <p className="font-bold text-lg">{session.roomName}</p>
                            <p className="text-gray-400">{new Date(session.startsAt).toLocaleString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-gray-400">Vagas</p>
                            <p className="font-bold text-lg flex items-center gap-2"><UsersIcon className="h-5 w-5"/>{session.availableSeats}</p>
                        </div>
                         <div className="text-center">
                            <p className="text-sm text-gray-400">Preço</p>
                            <p className="font-bold text-lg">R$ {session.basePrice.toFixed(2)}</p>
                        </div>
                        <div>
                            <button onClick={handleBuyTicket} className="w-full md:w-auto flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition">
                                <TicketIcon className="h-5 w-5 mr-2" /> Comprar
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="bg-gray-800 rounded-lg p-6 text-center">
                        <p>Nenhuma sessão disponível para este filme no momento.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}

export default PublicMovieView;
