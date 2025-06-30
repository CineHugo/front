import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { XMarkIcon, PencilSquareIcon, EnvelopeIcon, UserCircleIcon, ShieldCheckIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';

function UserModal({ user, isOpen, onClose, onUserUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        // email: '',
        // role: 'user',
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                // email: user.email || '',
                // role: user.role || 'user',
            });
        }
    }, [user]);

    if (!isOpen || !user) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            console.log(formData);
            const { data } = await api.patch(`/users/update/${user.id}`, formData);
            toast.success("Usuário atualizado com sucesso!");
            onUserUpdate(data);
            setIsEditing(false);
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Falha ao atualizar o usuário.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setIsEditing(false);
        onClose();
    };

    const InfoRow = ({ icon: Icon, label, value }) => (
        <div className="flex items-start space-x-3">
            <Icon className="h-6 w-6 text-gray-400 mt-1" />
            <div>
                <p className="text-sm text-gray-400">{label}</p>
                <p className="text-lg text-white">{value}</p>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
            <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg m-4 border border-gray-700">
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <h3 className="text-xl font-bold text-white">
                        {isEditing ? 'Editar Usuário' : 'Detalhes do Usuário'}
                    </h3>
                    <button onClick={handleClose} className="text-gray-400 hover:text-white">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {isEditing ? (
                    <form onSubmit={handleSaveChanges} className="p-6 space-y-4">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-300">Nome</label>
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="mt-1 w-full bg-gray-700 border-gray-600 rounded-md text-white"/>
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-300">Sobrenome</label>
                            <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="mt-1 w-full bg-gray-700 border-gray-600 rounded-md text-white"/>
                        </div>
                        {/* <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="mt-1 w-full bg-gray-700 border-gray-600 rounded-md text-white"/>
                        </div>
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-300">Role</label>
                            <select name="role" value={formData.role} className="mt-1 w-full bg-gray-700 border-gray-600 rounded-md text-white">
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div> */}
                    </form>
                ) : (
                    <div className="p-6 space-y-6">
                        <InfoRow icon={UserCircleIcon} label="Nome Completo" value={`${user.firstName} ${user.lastName}`} />
                        <InfoRow icon={EnvelopeIcon} label="Email" value={user.email} />
                        <InfoRow icon={ShieldCheckIcon} label="Role" value={user.role === 'admin' ? 'Administrador' : 'Usuário'} />
                        <InfoRow icon={CalendarDaysIcon} label="Membro Desde" value={new Date(user.createdAt).toLocaleDateString('pt-BR')} />
                    </div>
                )}

                <div className="flex items-center justify-end p-4 bg-gray-800/50 border-t border-gray-700 space-x-3 rounded-b-xl">
                    {isEditing ? (
                        <>
                            <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm rounded-md text-gray-300 hover:bg-gray-700">Cancelar</button>
                            <button onClick={handleSaveChanges} disabled={isLoading} className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400">
                                {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={handleClose} className="px-4 py-2 text-sm rounded-md text-gray-300 hover:bg-gray-700">Fechar</button>
                            <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700">
                                <PencilSquareIcon className="h-5 w-5" /> Editar
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserModal;
