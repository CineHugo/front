import { useState } from "react";
import { useProfile } from "../../hooks/useProfile";
import ProfileInfo from "../../components/ProfileInfo";
import ProfileModal from "../../components/ProfileModal";
import { Toaster } from "react-hot-toast";
import CineHugoLogo from "../../assets/cinehugo.svg";


function Profile() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, currentUser, isViewingOtherUser, setUser, logout, navigate, deleteUser } = useProfile();

  function openEditModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function handleUpdate(updatedUser) {
    setUser(updatedUser);
  }

  async function handleDelete() {
    if (window.confirm("Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.")) {
      try {
        await deleteUser(user.id);
        // Se o usuário deletou o próprio perfil, faça logout
        if (!isViewingOtherUser) {
          logout();
        } else {
          // Se admin deletou outro usuário, volte para a tela de admin
          navigate('/admin');
        }
      } catch (error) {
        alert("Erro ao excluir usuário.");
      }
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
              src={CineHugoLogo}
              alt="logo"
            />
            <span className="text-2xl font-semibold text-gray-900 dark:text-white">
              CineHugo
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
                {isViewingOtherUser ? 'Perfil do Usuário' : 'Meu Perfil'}
              </h2>
              <div className="flex gap-2">
                {currentUser && currentUser.role === 'admin' && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="px-3 py-2 text-sm font-medium text-white bg-gray-700 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300"
                  >
                    Voltar
                  </button>
                )}
                {/* Mostrar botão editar se: está no próprio perfil OU se é admin */}
                {!isViewingOtherUser || (currentUser && currentUser.role === 'admin') ? (
                  <>
                    <button
                      onClick={openEditModal}
                      className="px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Editar
                    </button>
                    <button
                      onClick={handleDelete}
                      className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-700 dark:hover:bg-red-800 dark:focus:ring-red-900"
                    >
                      Excluir
                    </button>
                  </>
                ) : null}
              </div>
            </div>
            <ProfileInfo user={user} />
          </div>
        </div>
      </div>

      {/* Modal de Edição */}
      <ProfileModal
        isOpen={isModalOpen}
        onClose={closeModal}
        user={user}
        currentUser={currentUser}
        isViewingOtherUser={isViewingOtherUser}
        onUpdate={handleUpdate}
      />
    </section>
  );
}

export default Profile;
