import {FC,useState} from 'react'
import { useRecoilState } from 'recoil';  
import { FindDialogOpen } from '../../../state/openClose';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import FindTask from '../find/find';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '../../ui/resizable';
import { ScrollArea,ScrollBar } from "../../ui/scroll-area"

import { motion, AnimatePresence } from "framer-motion";


const DashBord:FC=() => {
  const [FindOpen,setFindOpen] = useRecoilState(FindDialogOpen);

  const [isSelected, setSelected] = useState<boolean>(false);
  const [target,setTarget] = useState(null);
  

  const FindDailogHandler = () => {
    setFindOpen(!FindOpen);
  };

  const ClickHandler = (item:any) => {
    if(target === null && isSelected === false){
      setTarget(item);
      setSelected(true);
    } else {
      unregiter()
      setTimeout(() => {  
        setSelected(true);
        setTarget(item);
      }, 600);
    }
  };

  const unregiter = () =>{
    setSelected(false);
    setTarget(null);
  };

  const items = [
    {
      id:"1",
      subtitle:"sabtitle",
      title:"title",
    },
    {
      id:"2",
      subtitle:"sample",
      title:"sample title",
    },
    {
      id:"3",
      subtitle:"sample",
      title:"sample title",
    },
    {
      id:"4",
      subtitle:"sample",
      title:"sample title",
    },
    {
      id:"5",
      subtitle:"sabtitle",
      title:"title",
    },
    {
      id:"6",
      subtitle:"sample",
      title:"sample title",
    },
    {
      id:"7",
      subtitle:"sample",
      title:"sample title",
    },
    {
      id:"8",
      subtitle:"sample",
      title:"sample title",
    },
    {
      id:"9",
      subtitle:"sabtitle",
      title:"title",
    },
    {
      id:"10",
      subtitle:"sample",
      title:"sample title",
    },
    {
        id:"11",
      subtitle:"sample",
      title:"sample title",
    },
    {
      id:"12",
      subtitle:"sample",
      title:"sample title",
    },
  ];
  
  return (
    <ResizablePanelGroup
      direction='horizontal'
      className='max-w-[3/2-screen] rounded-lg border md:min-w-[500px]'
    >
      
      
      <ResizablePanel defaultSize={70}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={30} className='bg-slate-100'>
                <AnimatePresence >
                  {target && (
                  
                    <motion.div layoutId={target.id}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ type: "" }}
                      className='h-full'
                    >
                      <motion.button onClick={() => unregiter()} className='w-full h-full'> 
                      <Card className='flex flex-col justify-center items-center h-full hover:cursor-pointer hover:bg-slate-200'>
                        {/* <motion.h5>{target.subtitle}</motion.h5> */}
                        <motion.h2>{target.title}</motion.h2>
                        </Card> 
                      </motion.button>
                    </motion.div>
                  
                )}
                </AnimatePresence>
            </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel
                  defaultSize={50}
                >
                  <Card>
                    <h2>{target?.title}</h2>
                  </Card>
                </ResizablePanel>
            </ResizablePanelGroup>
      </ResizablePanel >
      <ResizableHandle />
      <ResizablePanel defaultSize={30}>
        <div className='p-2'>
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
        <ScrollArea className='h-[500px] bg-slate-100'>
          <ScrollBar orientation='horizontal' />
              
              {items.map(item => (
                <motion.div layoutId={item.id} onClick={() => ClickHandler(item)}>
          
                <Card  className='hover:cursor-pointer transition duration-100
                             hover:shadow-md hover:bg-slate-200'>
                  <motion.h5>{item.subtitle}</motion.h5>
                  <motion.h2>{item.title}</motion.h2>
                </Card>
                
                </motion.div>
        
              ))}

        </ScrollArea>
      </ResizablePanel>

   
    </ResizablePanelGroup>
  )
}



export default DashBord;