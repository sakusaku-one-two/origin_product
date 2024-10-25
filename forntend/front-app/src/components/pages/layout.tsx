import React from 'react';
import { SidebarProvider,SidebarTrigger } from '../ui/sidebar';
import AppSidebar from './appSidebar';
import { Outlet } from 'react-router-dom';
import Login from './loginDialog/login';
import { Button } from '../ui/button';
import { useRecoilState } from 'recoil';
import { LoginDialogOpen,FindDialogOpen } from '../../state/openClose';
import FindTask from './find/find';

const Layout:React.FC = ()=> {
  const [loginOpen,setLoginOpen] = useRecoilState(LoginDialogOpen);
  const [FindOpen,setFindOpen] = useRecoilState(FindDialogOpen);

  const loginModaleOpen = () => {
    setLoginOpen(!loginOpen);
  }

  const FindDailogHandler = () => {
    setFindOpen(!FindOpen);
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
                  <Button onClick={loginModaleOpen}>ログイン</Button>   
                  <Button className='inline-flex items-center gap-2 whitespace-nowrap transition-colors
                                     focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring 
                                     disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none 
                                     [&_svg]:size-4 [&_svg]:shrink-0 border border-input hover:bg-accent 
                                     hover:text-accent-foreground px-4 py-2 relative h-8 w-full 
                                     justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal 
                                     text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64'
                                     onClick={FindDailogHandler}>
                            打刻の検索 {<FindTask/>}
                  </Button>
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