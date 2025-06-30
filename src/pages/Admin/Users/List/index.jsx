import { useEffect, useState } from "react";
import { Link } from "react-router";
import Cookies from "js-cookie";
import toast, { Toaster } from 'react-hot-toast';
import { UsersIcon, TrashIcon, EyeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import UserModal from "../../../../components/Admin/UserModal";
import api from "../../../../services/api";

const TableRowSkeleton = () => (
    <tr className="animate-pulse">
        <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div></td>
        <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div></td>
        <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div></td>
        <td className="px-6 py-4 whitespace-nowrap text-center"><div className="flex justify-center items-center space-x-4"><div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded"></div><div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded"></div></div></td>
    </tr>
);

function AdminUserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);  

  useEffect(() => {
    async function getUsers() {
      try {
        setLoading(true);
        const { data } = await api.get("/users");
        setUsers(data);
      } catch (error) {
        toast.error("Falha ao carregar a lista de usuários.");
      } finally {
        setLoading(false);
      }
    }
    getUsers();
  }, []);

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleUserUpdate = (updatedUser) => {
    setUsers(prevUsers => prevUsers.map(user => user.id === updatedUser.id ? updatedUser : user));
  };

  const handleDeleteUser = async (userId) => {
    const currentUserData = Cookies.get('user');
    if (currentUserData && JSON.parse(currentUserData).id === userId) {
        toast.error("Você não pode excluir seu próprio usuário.");
        return;
    }
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        await api.delete(`/users/delete/${userId}`);
        toast.success("Usuário excluído com sucesso!");
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      } catch (error) {
        toast.error("Falha ao excluir o usuário.");
      }
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-4 sm:p-6 lg:p-8">
        <Toaster position="top-right" />
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
              <div className="flex items-center space-x-3">
                  <UsersIcon className="h-10 w-10 text-red-600 dark:text-red-500" />
                  <h1 className="text-3xl md:text-4xl font-bold">Gerenciamento de Usuários</h1>
              </div>
              <Link to="/admin" className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                  <ArrowLeftIcon className="h-5 w-5" />
                  Voltar ao Painel
              </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nome</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {loading ? (
                    <><TableRowSkeleton /><TableRowSkeleton /><TableRowSkeleton /></>
                  ) : users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium">{user.firstName} {user.lastName}</div></td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <div className="flex items-center justify-center space-x-4">
                            {/* 4. Botão agora abre o modal */}
                            <button onClick={() => handleViewUser(user)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300" title="Ver Detalhes">
                              <EyeIcon className="h-5 w-5" />
                            </button>
                            <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900 dark:text-red-500 dark:hover:text-red-400" title="Excluir Usuário">
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="4" className="text-center py-10 text-gray-500">Nenhum usuário encontrado.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      <UserModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
        onUserUpdate={handleUserUpdate}
      />
    </>
  );
}

export default AdminUserList;
