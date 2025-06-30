import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import api from '../../../../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { ArrowLeftIcon, FilmIcon, PhotoIcon } from '@heroicons/react/24/outline';

const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    let cleanedPath = imagePath.startsWith('undefined/') ? imagePath.substring(10) : imagePath;
    const baseUrl = api.defaults.baseURL.endsWith('/') ? api.defaults.baseURL : `${api.defaults.baseURL}/`;
    return `${baseUrl}${cleanedPath}`;
};

function AdminMovieEdit() {
    const { movieId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        synopsis: '',
        releaseDate: '',
    });
    const [mainImage, setMainImage] = useState({ file: null, preview: '' });
    const [bannerImage, setBannerImage] = useState({ file: null, preview: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        async function fetchMovie() {
            try {
                const { data } = await api.get(`/movies/movie/${movieId}`);
                
                const releaseDate = data.releaseDate ? new Date(data.releaseDate).toISOString().split('T')[0] : '';
                
                setFormData({
                    title: data.title,
                    synopsis: data.synopsis,
                    releaseDate: releaseDate,
                });

                setMainImage({ file: null, preview: getImageUrl(data.mainImageUrl) });
                setBannerImage({ file: null, preview: getImageUrl(data.bannerImageUrl) });

            } catch (error) {
                toast.error("Falha ao carregar os dados do filme para edição.");
                navigate('/admin/movies');
            } finally {
                setIsFetching(false);
            }
        }
        fetchMovie();
    }, [movieId, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e, setImageState) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageState({
            file: file,
            preview: URL.createObjectURL(file)
        });
    };
    
    const convertFileToBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const payload = { ...formData };

            if (mainImage.file) {
                const base64 = await convertFileToBase64(mainImage.file);
                payload.mainImageUrl = {
                    mimeType: mainImage.file.type,
                    data: base64.split(',')[1]
                };
            }
            if (bannerImage.file) {
                const base64 = await convertFileToBase64(bannerImage.file);
                payload.bannerImageUrl = {
                    mimeType: bannerImage.file.type,
                    data: base64.split(',')[1]
                };
            }

            await api.patch(`/movies/update/${movieId}`, payload);
            toast.success("Filme atualizado com sucesso!");
            setTimeout(() => navigate('/admin/movies'), 1500);

        } catch (error) {
            console.error("Erro ao atualizar filme:", error);
            toast.error(error.response?.data?.message || "Erro ao atualizar o filme.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return <div className="flex justify-center items-center min-h-screen">Carregando...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
            <Toaster position="top-right" />
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-3">
                        <FilmIcon className="h-10 w-10 text-red-600 dark:text-red-500" />
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                            Editar Filme
                        </h1>
                    </div>
                    <Link
                        to="/admin/movies"
                        className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                        Voltar
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl space-y-8">
                    {/* Campos do Formulário (Inputs e Textarea) */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Título do Filme</label>
                                <input type="text" name="title" id="title" value={formData.title} onChange={handleInputChange} required className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 text-gray-900 dark:text-white"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Gênero</label>
                                <input type="text" className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 text-gray-900 dark:text-white"/>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="releaseDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data de Lançamento</label>
                            <input type="date" name="releaseDate" id="releaseDate" value={formData.releaseDate} onChange={handleInputChange} required className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 text-gray-900 dark:text-white"/>
                        </div>
                        <div>
                            <label htmlFor="synopsis" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sinopse</label>
                            <textarea name="synopsis" id="synopsis" rows="4" value={formData.synopsis} onChange={handleInputChange} required className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 text-gray-900 dark:text-white"></textarea>
                        </div>
                    </div>

                    {/* Upload de Imagens */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                        {/* Imagem Principal */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Alterar Imagem Principal (Pôster)</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    {mainImage.preview ? (
                                        <img src={mainImage.preview} alt="Preview do Pôster" className="mx-auto h-48 w-auto rounded-md"/>
                                    ) : (
                                        <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    )}
                                    <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                                        <label htmlFor="main_image_input" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-red-600 hover:text-red-500">
                                            <span>Carregar novo arquivo</span>
                                            <input id="main_image_input" type="file" className="sr-only" onChange={(e) => handleFileChange(e, setMainImage)} accept="image/*"/>
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-500">Deixe em branco para manter a imagem atual</p>
                                </div>
                            </div>
                        </div>

                        {/* Imagem do Banner */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Alterar Imagem do Banner</label>
                             <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    {bannerImage.preview ? (
                                        <img src={bannerImage.preview} alt="Preview do Banner" className="mx-auto h-48 w-auto rounded-md aspect-video object-cover"/>
                                    ) : (
                                        <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    )}
                                    <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                                        <label htmlFor="banner_image_input" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-red-600 hover:text-red-500">
                                            <span>Carregar novo arquivo</span>
                                            <input id="banner_image_input" type="file" className="sr-only" onChange={(e) => handleFileChange(e, setBannerImage)} accept="image/*"/>
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-500">Deixe em branco para manter a imagem atual</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Botão de Envio */}
                    <div className="pt-5">
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full md:w-auto flex justify-center py-3 px-8 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none disabled:bg-red-400"
                            >
                                {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AdminMovieEdit;