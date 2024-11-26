import React from "react";

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup
  } from '../../ui/resizable';


function DashBordLayout(){
    {/** redux records */}




    return (
        <ResizablePanelGroup direction="vertical" >
            <ResizablePanel defaultSize={30}>
                {/* アラート領域  上部の横に右から左に並べる */}
                
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={100}>
                {/* メインとなる打刻領域 */}

                <ResizablePanelGroup direction="horizontal">
                    <ResizablePanel defaultSize={50}>
                        {/* 打刻領域 */}
                    </ResizablePanel>
                </ResizablePanelGroup>
            </ResizablePanel>

        </ResizablePanelGroup>
    );
};

export default DashBordLayout;  