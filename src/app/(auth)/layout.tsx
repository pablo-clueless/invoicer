import React from "react";

interface Props {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: Props) => {
  return (
    <div className="flex h-screen w-screen items-center">
      <div className="bg-auth h-full flex-1 bg-cover bg-center bg-no-repeat"></div>
      <div className="h-full min-w-[450px]">{children}</div>
    </div>
  );
};

export default AuthLayout;
