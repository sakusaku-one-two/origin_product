import React from 'react';
import { SidebarProvider,SidebarTrigger } from '../ui/sidebar';
import AppSidebar from './appSidebar';
import { Outlet } from 'react-router-dom';
import Login from './loginDialog/login';
import { Button } from '../ui/button';
import { useRecoilState } from 'recoil';
import { LoginDialogOpen } from '../../state/openClose';
import { LogOut,User } from 'lucide-react';
// import { useGetLoginInfo } from '@/hooks';
import { LoginInfo } from '@/redux/slices/loginSlice';
import { UPDATE as LOGIN_INFO } from '@/redux/slices/loginSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const Layout:React.FC = ()=> {
  const [loginOpen,setLoginOpen] = useRecoilState(LoginDialogOpen);
  const loginInfo = useSelector((state:RootState) => state.LOGIN);
  const dispatch = useDispatch();
  const loginModaleOpen = () => {
    setLoginOpen(!loginOpen);
  }

  const loguoutHandler = () => {
    fetch(`/api/logout`,{
      method:'POST'
    }).then(_ => {
        alert("ログアウトしました");
      }
    ).catch((_:Error) => {
      alert("ログアウトに失敗しました");
    }).finally(() => {
      const loginState:LoginInfo = {
        userName:'' as string,
        isLogin:false as boolean,
      };
      dispatch(LOGIN_INFO(loginState));
      
      window.location.reload();
    });

  
    

  };


  return (
    
    <SidebarProvider>
        <AppSidebar/>
        
        <body className="relative flex min-h-screen w-full flex-col bg-background">
         <header className="sticky top-0 z-50
                 w-full border-border/40 bg-background/95 bg-blue-500
                 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <div className='container flex  items-center gap-5'>
                  <SidebarTrigger />
                     {loginInfo.isLogin ?   <Button onClick={loguoutHandler}>ログアウト<LogOut/></Button> : <Button onClick={loginModaleOpen}>ログイン<User/></Button>}
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