import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children, activePage, setActivePage, user, onActionClick, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar activePage={activePage} setActivePage={setActivePage} user={user} />
      
      <div className="flex-1 flex flex-col ml-72">
        <Header 
          title={title} 
          subtitle={subtitle} 
          onActionClick={onActionClick} 
          user={user}
        />
        
        <main className="p-8 animate-in fade-in duration-500">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
