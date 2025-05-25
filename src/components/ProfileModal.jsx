import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

function ProfileModal({ isOpen, onClose, user, currentUser, onUpdate }) {
  const [editForm, setEditForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    role: user?.role || ''
  });

  function handleInputChange(e) {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const changedFields = {};
      
      if (editForm.firstName !== user.firstName) changedFields.firstName = editForm.firstName;
      if (editForm.lastName !== user.lastName) changedFields.lastName = editForm.lastName;
      if (editForm.email !== user.email) changedFields.email = editForm.email;
      if (editForm.role !== user.role) changedFields.role = editForm.role;

      if (Object.keys(changedFields).length === 0) {
        toast.info("Nenhuma alteração foi feita");
        onClose();
        return;
      }

      await api.patch(`/users/update/${user.id}`, changedFields);
      
      const updatedUser = { ...user, ...changedFields };
      onUpdate(updatedUser);
      
      if (user.id === currentUser.id) {
        Cookies.set('user', JSON.stringify(updatedUser), {
          sameSite: 'Strict',
          secure: location.protocol === 'https:',
          expires: 7
        });
      }
      
      onClose();
      toast.success("Dados atualizados com sucesso!");
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data || "Erro ao atualizar dados";
      toast.error(errorMessage);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md mx-4 bg-white rounded-lg shadow dark:bg-gray-800">
        <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Editar Perfil
          </h3>
          <button onClick={onClose} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nome</label>
            <input type="text" id="firstName" name="firstName" value={editForm.firstName} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" required />
          </div>
          
          <div>
            <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sobrenome</label>
            <input type="text" id="lastName" name="lastName" value={editForm.lastName} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" required />
          </div>
          
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
            <input type="email" id="email" name="email" value={editForm.email} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" required />
          </div>
          
          {currentUser && currentUser.role === 'admin' && (
            <div>
              <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tipo de Usuário</label>
              <select id="role" name="role" value={editForm.role} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" required>
                <option value="user">Usuário</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          )}
          
          <div className="flex justify-end space-x-2 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileModal;
