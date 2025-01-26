import { useEffect } from "react";
// import {
//   Calculator,
//   CreditCard,
//   Settings,
//   User,
// } from "lucide-react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
// CommandSeparator,
// CommandShortcut,
 } from "../../ui/command";
import { FindDialogOpen } from "../../../state/openClose";
import { useRecoilState } from "recoil";
import { useGetWaitingTimeRecordsWithOtherRecord } from "../../../hooks";
import TimeCard from "../dasbord/timeCard/timeCard";
import { useSelectedRecordsDispatch } from "../../../hooks";
import { CardType } from "../dasbord/timeCard/cardHelper";
var FindTask = function () {
    var _a = useRecoilState(FindDialogOpen), open = _a[0], setIsOpen = _a[1];
    // const selectedRecords = useSelectedRecordsSelector();
    var dispatch = useSelectedRecordsDispatch();
    var records = useGetWaitingTimeRecordsWithOtherRecord();
    useEffect(function () {
        var down = function (e) {
            if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsOpen(function (open) { return !open; });
            }
        };
        document.addEventListener("keydown", down);
        return function () { return document.removeEventListener("keydown", down); };
    }, [setIsOpen]);
    return (React.createElement(React.Fragment, null,
        React.createElement("p", { className: "text-sm text-muted-foreground" },
            "Press",
            " ",
            React.createElement("kbd", { className: "pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100" },
                React.createElement("span", { className: "text-xs" }, "\u2318"),
                "J")),
        React.createElement(CommandDialog, { open: open, onOpenChange: setIsOpen },
            React.createElement(CommandInput, { placeholder: "Type a command or search..." }),
            React.createElement(CommandList, null,
                React.createElement(CommandEmpty, null, "No results found."),
                React.createElement(CommandGroup, { heading: "Suggestions" },
                    records.map(function (record) { return (React.createElement(CommandItem, { key: record.timeRecord.ID, onSelect: function () {
                            dispatch({ type: "SELECTED_RECORDS/UPDATE", payload: record });
                            setIsOpen(false);
                        } },
                        React.createElement(TimeCard, { record: record, cardType: CardType.Wait }))); }),
                    React.createElement(CommandItem, { onSelect: function () {
                            dispatch({ type: "SELECTED_RECORDS/UPDATE", payload: null });
                            setIsOpen(false);
                        } }))))));
};
export default FindTask;
