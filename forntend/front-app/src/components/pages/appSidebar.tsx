import React  from 'react';
import { useState } from 'react';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarMenu,
} from "@/components/ui/sidebar";
import { CircleUser,
        PlaneTakeoff,
        Crosshair ,
        FileInput,
        FileOutput,
        FileSymlink,
        UserCheck,

} from "lucide-react";

import { SidebarGroupContent, SidebarGroupLabel } from '../ui/sidebar';
import SidebarItem from './components/SidebarItem';




export interface Item {
    title:string,
    url:string,
    icon:any,
    onExecute?:(item:Item)=> void,
    description?:string | undefined
}




const AppSidebar:React.FC = () => {
    const items:Item[] = [
    {
        title:"ダッシュボード",
        url:"dashbord",
        icon:CircleUser,
        description:"本日の勤務者一覧を表示します。"
    },
    {
        title:"隊員一覧",
        url:"employeeList",
        icon:UserCheck,
        description:"隊員一覧を表示します。"
    },
    {
        title:"隊員別の出発時間の設定",
        url:"configEmployee",
        icon:PlaneTakeoff,
        description:"出発報告のための自宅から現場までの移動時間を入力。初期値は1:30前"
    },
    {
        title:"打刻履歴",
        url:"attendanceRecordLog",
        icon:Crosshair,
        description:"打刻履歴を表示します。"
    },
    {
        title:"CSVインポート",
        url:"inportCsv",
        icon:FileInput,
        description:"ビジコン（CSVプロ）から管制実績データのCSVを読み込みます。"
    },
    {
        title:"実績引き継ぎ",
        url:"inportData",
        icon:FileSymlink,
        description:"引き継ぎデータを読み込みます（ローカル使用のみ）"

    },
    {
        title:"実績出力",
        url:"output",
        icon:FileOutput,
        description:"CSVで打刻した実績情報を排出します。"
    }
];



    const [discription,setDescription] = useState<string>("");

    return (
    <Sidebar className="">
        <SidebarContent>
            <SidebarGroup>
                <SidebarGroupLabel>報告スパルタン</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu className="gap-3">
                        {items.map((item:Item) =>(
                            <SidebarItem item={item} chengeDescription={setDescription} />
                        ))}
                    </SidebarMenu>
                    <br />
                    <br />
                    <SidebarFooter>
                        
                            {discription}
                            
                    </SidebarFooter>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar;