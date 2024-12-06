import React from "react"
import  {AlertList}  from "./alert/alertList";
import SelectCardsArea from "./selectCardsArea/selectCardsArea";

const DashBordLayout:React.FC = ( ) => {
    {/** redux records */}




    return (
        <div className="flex flex-col">
            <span className="h-1/2">
                <AlertList/>
            </span>
            <span className="h-1/2">
              <SelectCardsArea />
            </span>
        </div>
    );
};

export default DashBordLayout;  