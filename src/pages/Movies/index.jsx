import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import api from '../../services/api';
import { FilmIcon, PencilSquareIcon, EyeIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import toast, { Toaster } from 'react-hot-toast';

const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    let cleanedPath = imagePath.startsWith('undefined/') ? imagePath.substring(10) : imagePath;
    const baseUrl = api.defaults.baseURL.endsWith('/') ? api.defaults.baseURL : `${api.defaults.baseURL}/`;
    return `${baseUrl}${cleanedPath}`;
};

function AdminMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMovies() {
      try {
        setLoading(true);
        const { data } = await api.get('/movies');
        setMovies(data);
      } catch (error) {
        toast.error('Falha ao carregar os filmes.');
        console.error("Erro ao buscar filmes:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, []);

  const handleEdit = (movieId) => {
    navigate(`/admin/movies/edit/${movieId}`);
  };

  const handleView = (movieId) => {
    navigate(`/admin/movies/view/${movieId}`);
  };
  
  const handleAddNewMovie = () => {
    navigate('/admin/movies/new');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-4 sm:p-6 lg:p-8">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <FilmIcon className="h-10 w-10 text-red-600 dark:text-red-500" />
            <h1 className="text-3xl md:text-4xl font-bold">
              Gerenciamento de Filmes
            </h1>
          </div>
          <button
            onClick={handleAddNewMovie}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            <PlusCircleIcon className="h-6 w-6" />
            Cadastrar Filme
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Pôster</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Título</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Gênero</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-10">
                      <p>Carregando filmes...</p>
                    </td>
                  </tr>
                ) : movies.length > 0 ? (
                  movies.map((movie) => (
                    <tr key={movie.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img 
                          src={getImageUrl(movie.mainImageUrl)} 
                          alt={`Pôster de ${movie.title}`} 
                          className="w-10 h-15 rounded object-cover" 
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium">{movie.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{movie.genre || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex items-center justify-center space-x-4">
                          <button onClick={() => handleView(movie.id)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300" title="Visualizar">
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          <button onClick={() => handleEdit(movie.id)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300" title="Editar">
                            <PencilSquareIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-10">
                      <p>Nenhum filme cadastrado.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminMovies;