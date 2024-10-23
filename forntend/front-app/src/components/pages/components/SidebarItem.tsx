import React from 'react';
import { useState } from 'react';
import { Item } from '../appSidebar';
import { SidebarMenuButton, SidebarMenuItem } from '../../ui/sidebar';
import { Card } from '../../ui/card';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
  } from "../../ui/hover-card"
  

const SidebarItem:React.FC<{item:Item,chengeDescription:Function}> = ({item,chengeDescription}) => {
    
    const [IsSpin,setIsSpin] = useState<string>("");
    const [IsBounce,setIsBounce] = useState<string>("");
    

    const ClickHandler = () => {
        setIsBounce("");
        setIsSpin("animate-jump-out animate-once animate-ease-out animate-fill-both");
        item?.onExecute?.(item);
       
    };


    const HoverHandler = (openFlag:boolean) => {
        if (openFlag) {
            chengeDescription(item.description);
            setIsBounce("animate-bounce");
        }else {
            chengeDescription("");
            setIsBounce("");
            setIsSpin("");
        }
    };

    const iconCss:string = `${IsSpin} ${IsBounce}`;
    
    return (
    <button>
    <Card key={item.title} onClick={ClickHandler} 
                             onMouseEnter={() => HoverHandler(true)}
                             onMouseLeave={() => HoverHandler(false)}
                             className='p-10 py-5 flex
                             items-center transition duration-500
                             hover:shadow-xl hover:shadow-cyan-500/50
                              '>
        <SidebarMenuItem>
            <SidebarMenuButton asChild />
            <div className='flex gap-5 flex items-center'>
                <item.icon className={iconCss} />
                <span>{item.title}</span>
            </div>
            
            <HoverCard>
                <HoverCardTrigger >         </HoverCardTrigger>
                    <HoverCardContent>
                        {item.description}
                    </HoverCardContent>
            </HoverCard>

        </SidebarMenuItem>
    </Card>
    </button>
  )
};

export default SidebarItem;

