import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import Cookies from "js-cookie";
import api from "../services/api";

export function useProfile() {
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isViewingOtherUser, setIsViewingOtherUser] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const viewingUserId = searchParams.get('userId');

  async function fetchUserData(userId) {
    try {
      const response = await api.get(`/users/${userId}`);
      setUser(response.data);
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
    }
  }

  function logout() {
    Cookies.remove('token');
    Cookies.remove('user');
    navigate('/login');
  }

  async function deleteUser(id) {
    await api.delete(`/users/delete/${id}`);
  }

  useEffect(() => {
    const userData = Cookies.get('user');
    let currentUserData = null;
    
    if (userData && userData !== 'undefined') {
      try {
        currentUserData = JSON.parse(userData);
        setCurrentUser(currentUserData);
      } catch (error) {
        console.error('Erro ao fazer parse dos dados do usuário:', error);
        navigate('/login');
        return;
      }
    } else {
      navigate('/login');
      return;
    }

    if (viewingUserId) {
      const isOtherUser = viewingUserId !== currentUserData.id;
      setIsViewingOtherUser(isOtherUser);
      fetchUserData(viewingUserId);
    } else {
      setIsViewingOtherUser(false);
      setUser(currentUserData);
      if (currentUserData.id) {
        fetchUserData(currentUserData.id);
      }
    }
  }, [navigate, viewingUserId]);

  return {
    user,
    currentUser,
    isViewingOtherUser,
    setUser,
    logout,
    navigate,
    deleteUser
  };
}
