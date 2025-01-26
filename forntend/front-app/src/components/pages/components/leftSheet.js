import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger, } from "@/components/ui/sheet";
var SHEET_SIDES = ["top", "right", "bottom", "left"];
export function SheetSide() {
    return (React.createElement("div", { className: "grid grid-cols-2 gap-2" }, SHEET_SIDES.map(function (side) { return (React.createElement(Sheet, { key: side },
        React.createElement(SheetTrigger, { asChild: true },
            React.createElement(Button, { variant: "outline" }, side)),
        React.createElement(SheetContent, { side: side },
            React.createElement(SheetHeader, null,
                React.createElement(SheetTitle, null, "Edit profile"),
                React.createElement(SheetDescription, null, "Make changes to your profile here. Click save when you're done.")),
            React.createElement("div", { className: "grid gap-4 py-4" },
                React.createElement("div", { className: "grid grid-cols-4 items-center gap-4" },
                    React.createElement(Label, { htmlFor: "name", className: "text-right" }, "Name"),
                    React.createElement(Input, { id: "name", value: "Pedro Duarte", className: "col-span-3" })),
                React.createElement("div", { className: "grid grid-cols-4 items-center gap-4" },
                    React.createElement(Label, { htmlFor: "username", className: "text-right" }, "Username"),
                    React.createElement(Input, { id: "username", value: "@peduarte", className: "col-span-3" }))),
            React.createElement(SheetFooter, null,
                React.createElement(SheetClose, { asChild: true },
                    React.createElement(Button, { type: "submit" }, "Save changes")))))); })));
}
