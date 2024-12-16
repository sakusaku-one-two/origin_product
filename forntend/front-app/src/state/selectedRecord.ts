import { atom, useRecoilState } from "recoil";
import { TimeRecordWithOtherRecord } from "../hooks";
// import TimeCard from "../components/pages/dasbord/timeCard";

export type SelectedRecordType = {record:TimeRecordWithOtherRecord | null,isSelected:boolean};

export const SelectedRecord = atom<SelectedRecordType>({
    key:"SelectedRecord",
    default:{
        record:null,
        isSelected:false,
    },  
});

export const useSelectedRecord = ():[SelectedRecordType,(updateData:SelectedRecordType)=>void] => {
    const [selectedRecord,setSelectedRecord] = useRecoilState(SelectedRecord);
    return [selectedRecord,(updateData:SelectedRecordType) => setSelectedRecord(updateData)];
};
