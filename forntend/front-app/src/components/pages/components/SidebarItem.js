import React from 'react';
import { useState } from 'react';
import { SidebarMenuButton, SidebarMenuItem } from '../../ui/sidebar';
import { Card } from '../../ui/card';
import { useNavigate, useLocation } from 'react-router-dom';
var SidebarItem = function (_a) {
    var item = _a.item, chengeDescription = _a.chengeDescription;
    var locationPath = useLocation().pathname.replace('/', '');
    var _b = useState(""), IsSpin = _b[0], setIsSpin = _b[1];
    var _c = useState(""), IsBounce = _c[0], setIsBounce = _c[1];
    var navigate = useNavigate();
    var ClickHandler = function () {
        var _a;
        setIsBounce("");
        setIsSpin("animate-jump-out animate-once animate-ease-out animate-fill-both");
        (_a = item.onExecute) === null || _a === void 0 ? void 0 : _a.call(item, item);
        navigate(item.url);
    };
    var HoverHandler = function (openFlag) {
        var _a;
        if (openFlag) {
            chengeDescription((_a = item.description) !== null && _a !== void 0 ? _a : "");
            setIsBounce("animate-bounce");
        }
        else {
            chengeDescription("");
            setIsBounce("");
            setIsSpin("");
        }
    };
    var iconCss = "".concat(IsSpin, " ").concat(IsBounce);
    var bgColor = locationPath == item.url ? 'bg-slate-300' : 'hover:shadow-md hover:bg-slate-200';
    return (React.createElement("button", null,
        React.createElement(Card, { key: item.title, onClick: ClickHandler, onMouseEnter: function () { return HoverHandler(true); }, onMouseLeave: function () { return HoverHandler(false); }, className: "p-10 py-5 flex items-center transition duration-500 ".concat(bgColor) },
            React.createElement(SidebarMenuItem, null,
                React.createElement(SidebarMenuButton, { asChild: true }),
                React.createElement("div", { className: 'flex gap-5 flex items-center' },
                    React.createElement(item.icon, { className: iconCss }),
                    React.createElement("span", null, item.title))))));
};
export default SidebarItem;
