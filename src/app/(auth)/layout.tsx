import React from "react";

interface Props {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: Props) => {
  return (
    <div className="grid h-screen w-screen grid-cols-4">
      <div className="col-span-3 h-full"></div>
      <div className="h-full">{children}</div>
    </div>
  );
};

export default AuthLayout;
