import { useNavigate, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import api from "../../services/api";
import toast, { Toaster } from "react-hot-toast";

function Profile() {
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: ''
  });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const viewingUserId = searchParams.get('userId');

  function logout() {
    Cookies.remove('token');
    Cookies.remove('user');
    navigate("/login");
  }

  function openEditModal() {
    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  }

  async function updateUser(e) {
    e.preventDefault();
    try {
      // Criar objeto apenas com campos alterados
      const changedFields = {};
      
      if (editForm.firstName !== user.firstName) {
        changedFields.firstName = editForm.firstName;
      }
      if (editForm.lastName !== user.lastName) {
        changedFields.lastName = editForm.lastName;
      }
      if (editForm.email !== user.email) {
        changedFields.email = editForm.email;
      }
      if (editForm.role !== user.role) {
        changedFields.role = editForm.role;
      }

      // Só fazer a requisição se houver campos alterados
      if (Object.keys(changedFields).length === 0) {
        toast.info("Nenhuma alteração foi feita");
        setIsModalOpen(false);
        return;
      }

      const { data } = await api.patch(`/users/update/${user.id}`, changedFields);
      
      // Atualizar dados do usuário nos cookies
      const updatedUser = { ...user, ...changedFields };
      Cookies.set('user', JSON.stringify(updatedUser), {
        sameSite: 'Strict',
        secure: location.protocol === 'https:',
        expires: 7
      });
      
      setUser(updatedUser);
      setIsModalOpen(false);
      toast.success("Dados atualizados com sucesso!");
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data || "Erro ao atualizar dados";
      toast.error(errorMessage);
      console.error(error);
    }
  }

  useEffect(() => {
    if (viewingUserId) {
      // Visualizando perfil de outro usuário
      fetchUserData(viewingUserId);
    } else {
      // Visualizando próprio perfil
      const userData = Cookies.get('user');
      if (userData && userData !== 'undefined') {
        try {
          const parsedUser = JSON.parse(userData);
          setCurrentUser(parsedUser);
          setUser(parsedUser);
          
          if (parsedUser.id) {
            fetchUserData(parsedUser.id);
          }
        } catch (error) {
          console.error('Erro ao fazer parse dos dados do usuário:', error);
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    }
  }, [navigate, viewingUserId]);

  async function fetchUserData(userId) {
    try {
      const response = await api.get(`/users/${userId}`);
      setUser(response.data);
      
      // Atualizar cookie com dados mais recentes
      Cookies.set('user', JSON.stringify(response.data), {
        sameSite: 'Strict',
        secure: location.protocol === 'https:',
        expires: 7
      });
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      // Se der erro na requisição, manter dados do cookie
    }
  }

  if (!user) {
    return <div>Carregando...</div>;
  }

  return (
    <section>
      <Toaster position="top-right" />
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-16">
        <div className="flex items-center justify-between w-full max-w-md mb-6">
          <div className="flex items-center gap-4">
            <img
              className="w-8 h-8 mr-2"
              src="/src/assets/meeting.png"
              alt="logo"
            />
            <span className="text-2xl font-semibold text-gray-900 dark:text-white">
              MeetUnimontes
            </span>
          </div>

          <button
            onClick={logout}
            className="px-3 py-2 text-sm font-medium text-white bg-gray-700 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
          >
            Logout
          </button>
        </div>

        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-8 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                {viewingUserId ? 'Perfil do Usuário' : 'Meu Perfil'}
              </h2>
              <div className="flex gap-2">
                {viewingUserId && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="px-3 py-2 text-sm font-medium text-white bg-gray-700 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300"
                  >
                    Voltar
                  </button>
                )}
                {!viewingUserId && (
                  <button
                    onClick={openEditModal}
                    className="px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Editar
                  </button>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Nome
                </label>
                <p className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  {user.firstName}
                </p>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Sobrenome
                </label>
                <p className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  {user.lastName}
                </p>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Email
                </label>
                <p className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  {user.email}
                </p>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Tipo de Usuário
                </label>
                <p className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  {user.role === 'admin' ? 'Administrador' : 'Usuário'}
                </p>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Membro desde
                </label>
                <p className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : 'Data não disponível'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-md mx-4 bg-white rounded-lg shadow dark:bg-gray-800">
            <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Editar Perfil
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
              </button>
            </div>
            
            <form onSubmit={updateUser} className="p-6 space-y-4">
              <div>
                <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Nome
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={editForm.firstName}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Sobrenome
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={editForm.lastName}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  required
                />
              </div>
              
              {/* Campo Role - apenas para admins */}
              {currentUser && currentUser.role === 'admin' && (
                <div>
                  <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Tipo de Usuário
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={editForm.role}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    required
                  >
                    <option value="user">Usuário</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              )}
              
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default Profile;
