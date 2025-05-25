function ProfileInfo({ user }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nome</label>
        <p className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
          {user.firstName}
        </p>
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sobrenome</label>
        <p className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
          {user.lastName}
        </p>
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
        <p className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
          {user.email}
        </p>
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tipo de Usuário</label>
        <p className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
          {user.role === 'admin' ? 'Administrador' : 'Usuário'}
        </p>
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Membro desde</label>
        <p className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
          {user.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : 'Data não disponível'}
        </p>
      </div>
    </div>
  );
}

export default ProfileInfo;
