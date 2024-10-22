import React from 'react';
import { SidebarProvider,SidebarTrigger } from '../ui/sidebar';
import AppSidebar from './appSidebar';
import { Outlet } from 'react-router-dom';

const Layout:React.FC = ()=> {
  return (
    <SidebarProvider>
        <AppSidebar/>
        <main>
            <SidebarTrigger />
            <Outlet />
        </main>
    </SidebarProvider>
  )
};

export default Layout;