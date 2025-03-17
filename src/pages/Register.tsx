
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import RegisterForm from '@/components/auth/RegisterForm';

const Register: React.FC = () => {
  return (
    <MainLayout showHeader={true} showFooter={false} showBackButton={true} title="Register">
      <div className="p-4 flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
        <RegisterForm />
      </div>
    </MainLayout>
  );
};

export default Register;
