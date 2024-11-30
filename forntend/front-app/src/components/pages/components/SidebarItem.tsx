import React from 'react';
import { useState } from 'react';
import { Item } from '../appSidebar';
import { SidebarMenuButton, SidebarMenuItem } from '../../ui/sidebar';
import { Card } from '../../ui/card';
import { useNavigate } from 'react-router-dom';
  

const SidebarItem:React.FC<{item:Item,chengeDescription:(description:string)=>void}> = ({item,chengeDescription}) => {
    
    const [IsSpin,setIsSpin] = useState<string>("");
    const [IsBounce,setIsBounce] = useState<string>("");
    const navigate = useNavigate();

    const ClickHandler = () => {
        setIsBounce("");
        setIsSpin("animate-jump-out animate-once animate-ease-out animate-fill-both");
        item.onExecute?.(item);
        navigate(item.url);
    };


    const HoverHandler = (openFlag:boolean) => {
        if (openFlag) {
            chengeDescription(item.description ?? "" );
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
                             hover:shadow-md hover:bg-slate-200'>
        <SidebarMenuItem>
            <SidebarMenuButton asChild />
            <div className='flex gap-5 flex items-center'>
                <item.icon className={iconCss} />
                <span>{item.title}</span>
            </div>
        </SidebarMenuItem>
    </Card>
    </button>
  )
};

export default SidebarItem;

