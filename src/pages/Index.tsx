
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Welcome from './Welcome';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem('uzzap_user');
    if (user) {
      navigate('/home');
    }
  }, [navigate]);

  return <Welcome />;
};

export default Index;
