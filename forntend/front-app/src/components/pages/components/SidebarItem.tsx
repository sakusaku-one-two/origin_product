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
    const [onOpneState,setOpenState] = useState<boolean>(false);
    
    const onClikc = () =>{

    };
    return (
    <button>
    <Card key={item.title} onClick={onClikc} 
                             onMouseEnter={() => chengeDescription(item.description)}
                             onMouseLeave={() => chengeDescription("")}
                             className='p-10 py-5 flex
                             items-center transition duration-500
                              group hover:shadow-xl hover:shadow-cyan-500/50
                              '>
        <SidebarMenuItem>
            <SidebarMenuButton asChild />
            <div className='flex gap-5 flex items-center'>
                <item.icon className="" />
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

