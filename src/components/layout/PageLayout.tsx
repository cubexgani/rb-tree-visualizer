import React, { type ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
  title: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">{title}</h1>
        {children}
      </div>
    </div>
  );
};