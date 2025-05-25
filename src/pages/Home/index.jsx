import Trash from "../../assets/trash.svg";
import api from "../../services/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";

function Home() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  async function getUsers() {
    const usersFromApi = await api.get("/users");

    setUsers(usersFromApi.data);
  }

  async function deleteUsers(id) {
    await api.delete(`/users/delete/${id}`);

    getUsers();
  }

  function logout() {
    Cookies.remove("token");
    Cookies.remove("user");
    navigate("/login");
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      <section>
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-16">
          <div class="flex items-center justify-between w-full max-w-md mb-6">
            <div class="flex items-center gap-4">
              <img
                class="w-8 h-8 mr-2"
                src="/src/assets/meeting.png"
                alt="logo"
              />
              <span class="text-2xl font-semibold text-gray-900 dark:text-white">
                MeetUnimontes
              </span>
            </div>

            {/* Botão de Logout */}
            <button
              onClick={logout}
              className="px-3 py-2 text-sm font-medium text-white bg-gray-700 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
            >
              Logout
            </button>
          </div>

          {/* Listar Usuários */}
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-8 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h2 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Lista de Usuários
              </h2>
              {users.map((user) => (
                <div
                  key={user.id}
                  className="w-full bg-white rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700 p-6 mb-4"
                >
                  <div className="space-y-2">
                    <p className="text-sm text-gray-900 dark:text-gray-400">
                      <b>Nome:</b> {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm  text-gray-900 dark:text-gray-400">
                      <b>Email:</b> {user.email}
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => deleteUsers(user.id)}
                      className="flex items-center px-3 py-2 text-xs font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                    >
                      <img src={Trash} alt="Delete" className="w-5 h-5 mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
