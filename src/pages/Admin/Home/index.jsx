import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import Cookies from 'js-cookie';
import { UsersIcon, FilmIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import CineHugoLogo from "../../../assets/cinehugo.svg";

function AdminHome() {
    const navigate = useNavigate();
    const [adminName, setAdminName] = useState('');

    useEffect(() => {
        const userData = Cookies.get('user');
        if (userData) {
            const user = JSON.parse(userData);
            setAdminName(user.firstName || 'Admin');
        }
    }, []);

    const handleLogout = () => {
        Cookies.remove('token');
        Cookies.remove('user');
        navigate('/login');
    };

    const Card = ({ to, icon: Icon, title, description }) => (
        <Link to={to} className="group block p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-center h-16 w-16 bg-red-100 dark:bg-red-900/50 rounded-lg mb-6">
                <Icon className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{description}</p>
        </Link>
    );

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow-md">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center space-x-2">
                            <img className="w-8 h-8" src={CineHugoLogo} alt="logo" />
                            <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">CineHugo - Admin</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors"
                        >
                            <ArrowRightOnRectangleIcon className="h-6 w-6" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                    Bem-vindo, {adminName}!
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">
                    Selecione uma das opções abaixo para começar a gerenciar o sistema.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card
                        to="/admin/users"
                        icon={UsersIcon}
                        title="Gerenciar Usuários"
                        description="Visualize, edite e remova usuários cadastrados no sistema."
                    />
                    <Card
                        to="/admin/movies"
                        icon={FilmIcon}
                        title="Gerenciar Filmes"
                        description="Adicione, edite, visualize e remova filmes, salas e sessões."
                    />
                </div>
            </main>
        </div>
    );
}

export default AdminHome;
