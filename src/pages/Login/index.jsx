import api from "../../services/api";
import { useRef } from "react";
import { useNavigate, Link } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";

function Login() {
  const inputEmail = useRef();
  const inputPassword = useRef();
  const navigate = useNavigate();

  // Função para decodificar JWT e extrair o ID
  function decodeToken(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return null;
    }
  }

  async function loginUser(e) {
    e.preventDefault();
    try {
      const { data } = await api.post("/login", {
        email: inputEmail.current.value,
        password: inputPassword.current.value,
      });
      
      // Armazenar token como cookie com configurações de segurança
      Cookies.set('token', data.token, {
        sameSite: 'Strict',
        secure: location.protocol === 'https:',
        expires: 7
      });

      // Decodificar o token para extrair o ID do usuário
      const decodedToken = decodeToken(data.token);
      let userData = null;
      
      if (decodedToken && decodedToken.id) {
        try {
          const userResponse = await api.get(`/users/${decodedToken.id}`);
          userData = userResponse.data;
        } catch (userError) {
          console.error('Erro ao buscar dados do usuário:', userError);
          // Criar dados básicos se não conseguir buscar
          userData = {
            id: decodedToken.id,
            email: decodedToken.email || inputEmail.current.value,
            role: 'user' // padrão
          };
        }
      }

      // Só armazenar se userData não for null/undefined
      if (userData) {
        Cookies.set('user', JSON.stringify(userData), {
          sameSite: 'Strict',
          secure: location.protocol === 'https:',
          expires: 7
        });
      }

      toast.success("Login realizado com sucesso!");
      
      // Redirecionar baseado na role
      if (userData && userData.role === 'admin') {
        navigate("/admin");
      } else {
        navigate("/profile");
      }
    } catch (error) {
      const errorMessage = error.response?.data || "Erro ao fazer login";
      toast.error(errorMessage);
      console.error(error);
    }
  }

  return (
    <section>
      <Toaster position="top-right" />
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-16">
        <p class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img class="w-8 h-8 mr-2" src="/src/assets/meeting.png" alt="logo" />
          MeetUnimontes
        </p>
        <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Log in
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={loginUser}
              method="POST"
            >
              <div>
                <label
                  for="email"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="you@example.com"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required=""
                  ref={inputEmail}
                />
              </div>
              <div>
                <label
                  for="password"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required=""
                  ref={inputPassword}
                />
              </div>
              <div className="text-right">
                <button
                  type="submit"
                  class="px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Log in
                </button>
              </div>
            </form>
            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
              Don't have an account yet?{" "}
              <Link
                to="/register"
                class="font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
