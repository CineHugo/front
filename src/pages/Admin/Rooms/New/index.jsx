import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import api from '../../../../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { ArrowLeftIcon, ViewfinderCircleIcon } from '@heroicons/react/24/outline';

function AdminRoomNew() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [rows, setRows] = useState(10); // Default 10 fileiras
    const [cols, setCols] = useState(12); // Default 12 colunas
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!name || rows <= 0 || cols <= 0) {
            toast.error("Por favor, preencha todos os campos com valores válidos.");
            setIsLoading(false);
            return;
        }

        // Gera o mapa de assentos automaticamente
        const seatMap = [];
        const capacity = rows * cols;
        for (let i = 0; i < rows; i++) {
            const rowLabel = String.fromCharCode(65 + i); // A, B, C...
            for (let j = 1; j <= cols; j++) {
                seatMap.push({
                    label: `${rowLabel}${j}`,
                    row: rowLabel,
                    col: j,
                });
            }
        }
        
        const payload = {
            name,
            capacity,
            seatMap,
        };

        try {
            // Rota da API: POST /rooms/create
            await api.post('/rooms/create', payload);
            toast.success("Sala cadastrada com sucesso!");
            setTimeout(() => navigate('/admin/rooms'), 1500); // Volta para a lista de salas
        } catch (error) {
            console.error("Erro ao criar sala:", error);
            toast.error(error.response?.data?.message || "Erro ao criar a sala.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
         <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
            <Toaster position="top-right" />
            <div className="max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-3">
                        <ViewfinderCircleIcon className="h-10 w-10 text-red-600 dark:text-red-500" />
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                            Cadastrar Nova Sala
                        </h1>
                    </div>
                    <Link
                        to="/admin/rooms"
                        className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                        Voltar
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome da Sala</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ex: Sala 1 - IMAX"
                            required
                            className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 text-gray-900 dark:text-white"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="rows" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nº de Fileiras</label>
                            <input
                                type="number"
                                name="rows"
                                id="rows"
                                value={rows}
                                onChange={(e) => setRows(Number(e.target.value))}
                                min="1"
                                required
                                className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label htmlFor="cols" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nº de Assentos por Fileira</label>
                            <input
                                type="number"
                                name="cols"
                                id="cols"
                                value={cols}
                                onChange={(e) => setCols(Number(e.target.value))}
                                min="1"
                                required
                                className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>
                    
                     <div className="text-center bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                        <p className="text-gray-800 dark:text-gray-200">Capacidade Total: <span className="font-bold">{rows * cols > 0 ? rows * cols : 0}</span> assentos</p>
                    </div>

                    <div className="pt-5">
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full md:w-auto flex justify-center py-3 px-8 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none disabled:bg-red-400"
                            >
                                {isLoading ? 'Salvando...' : 'Salvar Sala'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AdminRoomNew;
