import React from 'react';
import { SidebarProvider,SidebarTrigger } from '../ui/sidebar';
import AppSidebar from './appSidebar';
import { Outlet } from 'react-router-dom';

const Layout:React.FC = ()=> {
  return (
    
    <SidebarProvider>
        <AppSidebar/>
        <body className="relative flex min-h-screen flex-col bg-background">
         <header className="sticky top-0 z-50
                 w-full border-border/40 bg-background/95 bg-blue-500
                 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <SidebarTrigger />
                  <div>
                    inosaku
                  </div>
                  
         </header>
         <main className='w-full'>
            <Outlet />
         </main>
        </body>
    </SidebarProvider>
    
  )
};

export default Layout;