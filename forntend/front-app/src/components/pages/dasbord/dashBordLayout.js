import React from "react";
import { AlertList } from "./alert/alertList";
import SelectCardsArea from "./selectCardsArea/selectCardsArea";
var DashBordLayout = function () {
    { /** redux records */ }
    return (React.createElement("div", { className: "flex flex-col" },
        React.createElement("span", { className: "h-1/2" },
            React.createElement(AlertList, null)),
        React.createElement("span", { className: "h-1/2" },
            React.createElement(SelectCardsArea, null))));
};
export default DashBordLayout;
