import {useState,useEffect} from 'react';
import {useNavigate} from 'react-router';
import api from '../../../services/api';
import toast,{Toaster} from 'react-hot-toast';
import {ViewfinderCircleIcon, PlusCircleIcon, TrashIcon} from '@heroicons/react/24/outline';

function AdminRoomList() {
    const [rooms,setRooms]=useState([]);
    const [loading,setLoading]=useState(true);
    const navigate=useNavigate();

    useEffect(() => {
        async function fetchRooms() {
            try {
                setLoading(true);
                const {data}=await api.get('/rooms'); // Rota para buscar salas
                setRooms(data);
            } catch(error) {
                toast.error("Falha ao carregar a lista de salas.");
            } finally {
                setLoading(false);
            }
        }
        fetchRooms();
    },[]);

    const handleDeleteRoom=async (roomId) => {
        if(window.confirm("Tem certeza que deseja excluir esta sala? Isso pode afetar sessões agendadas.")) {
            try {
                await api.delete(`/rooms/delete/${roomId}`);
                toast.success("Sala excluída com sucesso!");
                setRooms(prevRooms => prevRooms.filter(room => room._id!==roomId));
            } catch(error) {
                console.error("Erro ao excluir sala:",error);
                toast.error(error.response?.data?.message||"Falha ao excluir a sala.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-4 sm:p-6 lg:p-8">
            <Toaster position="top-right" />
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center space-x-3">
                        <ViewfinderCircleIcon className="h-10 w-10 text-red-600 dark:text-red-500" />
                        <h1 className="text-3xl md:text-4xl font-bold">Gerenciamento de Salas</h1>
                    </div>
                    <button onClick={() => navigate('/admin/rooms/new')} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                        <PlusCircleIcon className="h-6 w-6" />Cadastrar Sala
                    </button>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nome</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Capacidade</th>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ações</th>

                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {loading? (
                                    <tr><td colSpan="2" className="text-center py-10"><p>Carregando salas...</p></td></tr>
                                ):rooms.length>0? (
                                    rooms.map((room) => (
                                        <tr key={room.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                            <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium">{room.name}</div></td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">{room.capacity} assentos</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <button onClick={() => handleDeleteRoom(room._id)} className="text-red-600 hover:text-red-900 dark:text-red-500 dark:hover:text-red-400" title="Excluir Sala">
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ):(
                                    <tr><td colSpan="2" className="text-center py-10"><p>Nenhuma sala cadastrada.</p></td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminRoomList;
