import React from "react";

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup
  } from '../../ui/resizable';
import { AlertList } from "./alert/alertList";


const DashBordLayout:React.FC = ( ) => {
    {/** redux records */}




    return (
        <div className="flex flex-col">
            <span className="h-1/2">
                <AlertList/>
            </span>
            <span className="h-1/2">
            <ResizablePanelGroup
        direction="vertical"
        className="min-h-[500px] max-w-full rounded-lg border"
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
            </span>
        </div>
    );
};

export default DashBordLayout;  