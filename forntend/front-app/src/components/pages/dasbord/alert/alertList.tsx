import React from "react";
import { useGetAlertTimeRecordsWithOtherRecord } from "../../../../hooks";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup
  } from '../../../ui/resizable';
import  TimeCard  from "../timeCard";

export const AlertList:React.FC = () => {
    const alertTimeRecords = useGetAlertTimeRecordsWithOtherRecord();
    
    
    return (
        <ResizablePanelGroup
        direction="vertical"
        className="min-h-[300px] max-w-full rounded-lg border md:min-w-[450px]"
      >
        <ResizablePanel defaultSize={25}>
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Header</span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={75}>
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Content</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    );
};