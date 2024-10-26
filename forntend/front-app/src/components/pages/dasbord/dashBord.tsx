import {FC,useState} from 'react'
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { motion, AnimatePresence } from "framer-motion";
import { Subtitles } from 'lucide-react';
import { Title } from '@radix-ui/react-dialog';




const DashBord:FC=() => {
  const [isSelected, setSelected] = useState<boolean>(false);
  const [target,setTarget] = useState(null);


  const ClickHandler = (item:any) => {
    if(target === null && isSelected === false){
      setTarget(item);
      setSelected(true);
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
    }
  ];
  
  return (
    <div className='grid grid-cols-4 gap-4'>
            
      
      {items.map(item => (
        
        <motion.div layoutId={item.id} onClick={() => ClickHandler(item)}>
          <Card>
          <motion.h5>{item.subtitle}</motion.h5>
          <motion.h2>{item.title}</motion.h2>
          </Card>
        </motion.div>
        
      ))}

      <AnimatePresence >

        {target && (
          
          <motion.div layoutId={target.id}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          // transition={{ type: "spring" }}

          >
            <Card>
            <motion.h5>{target.subtitle}</motion.h5>
            <motion.h2>{target.title}</motion.h2>
            <motion.button onClick={() => unregiter()}> 
                <Button>
                  閉じる
                </Button>
            </motion.button>
            </Card> 
          </motion.div>
          
        )}
      </AnimatePresence>

    </div>
  )
}



export default DashBord;