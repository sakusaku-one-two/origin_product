import React from 'react';
import { SidebarProvider,SidebarTrigger } from '../ui/sidebar';
import AppSidebar from './appSidebar';
import { Outlet } from 'react-router-dom';
import Login from './loginDialog/login';
import { Button } from '../ui/button';
import { useRecoilState } from 'recoil';
import { LoginDialogOpen } from '../../state/openClose';

const Layout:React.FC = ()=> {
  const [loginOpen,setLoginOpen] = useRecoilState(LoginDialogOpen);
    
  const loginModaleOpen = () => {
    setLoginOpen(!loginOpen);
  }


  return (
    
    <SidebarProvider>
        <AppSidebar/>
        <body className="relative flex min-h-screen w-full flex-col bg-background">
         <header className="sticky top-0 z-50
                 w-full border-border/40 bg-background/95 bg-blue-500
                 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <div className='container flex  items-center gap-5'>
                  <SidebarTrigger />
                  <Button onClick={loginModaleOpen}>ログイン</Button>   
                  </div>
         </header>
         <main className='w-full'>
            <Outlet />
         </main>
        </body>
        <Login/>
        
    </SidebarProvider>
    
  )
};

export default Layout;