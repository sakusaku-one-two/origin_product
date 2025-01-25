import React from 'react';
import { SidebarProvider,SidebarTrigger } from '../ui/sidebar';
import AppSidebar from './appSidebar';
import { Outlet } from 'react-router-dom';
import Login from './loginDialog/login';
import { Button } from '../ui/button';
import { useRecoilState } from 'recoil';
import { LoginDialogOpen } from '../../state/openClose';
import { useLogin } from '@/state/loginState';
import { LogOut } from 'lucide-react';
const Layout:React.FC = ()=> {
  const [loginOpen,setLoginOpen] = useRecoilState(LoginDialogOpen);
  const [loginState,setLoginState] =useLogin();
  const loginModaleOpen = () => {
    setLoginOpen(!loginOpen);
  }

  const loguoutHandler = async () => {
    const response = await fetch(`/api/logout`,{
      method:'POST'
    });

    if (response.ok) {
      setLoginState({
        isLogin:false,
        userName:''
      });
    }

  };

  const loginButton = loginState.isLogin ?   <Button onClick={loguoutHandler}>ログアウト<LogOut/></Button>:<Button onClick={loginModaleOpen}>ログイン</Button>

  return (
    
    <SidebarProvider>
        <AppSidebar/>
        <body className="relative flex min-h-screen w-full flex-col bg-background">
         <header className="sticky top-0 z-50
                 w-full border-border/40 bg-background/95 bg-blue-500
                 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <div className='container flex  items-center gap-5'>
                  <SidebarTrigger />
                     {loginButton}
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