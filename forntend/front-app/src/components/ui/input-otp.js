var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import * as React from "react";
import { DashIcon } from "@radix-ui/react-icons";
import { OTPInput, OTPInputContext } from "input-otp";
import { cn } from "@/lib/utils";
var InputOTP = React.forwardRef(function (_a, ref) {
    var className = _a.className, containerClassName = _a.containerClassName, props = __rest(_a, ["className", "containerClassName"]);
    return (React.createElement(OTPInput, __assign({ ref: ref, containerClassName: cn("flex items-center gap-2 has-[:disabled]:opacity-50", containerClassName), className: cn("disabled:cursor-not-allowed", className) }, props)));
});
InputOTP.displayName = "InputOTP";
var InputOTPGroup = React.forwardRef(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (React.createElement("div", __assign({ ref: ref, className: cn("flex items-center", className) }, props)));
});
InputOTPGroup.displayName = "InputOTPGroup";
var InputOTPSlot = React.forwardRef(function (_a, ref) {
    var index = _a.index, className = _a.className, props = __rest(_a, ["index", "className"]);
    var inputOTPContext = React.useContext(OTPInputContext);
    var _b = inputOTPContext.slots[index], char = _b.char, hasFakeCaret = _b.hasFakeCaret, isActive = _b.isActive;
    return (React.createElement("div", __assign({ ref: ref, className: cn("relative flex h-9 w-9 items-center justify-center border-y border-r border-input text-sm shadow-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md", isActive && "z-10 ring-1 ring-ring", className) }, props),
        char,
        hasFakeCaret && (React.createElement("div", { className: "pointer-events-none absolute inset-0 flex items-center justify-center" },
            React.createElement("div", { className: "h-4 w-px animate-caret-blink bg-foreground duration-1000" })))));
});
InputOTPSlot.displayName = "InputOTPSlot";
var InputOTPSeparator = React.forwardRef(function (_a, ref) {
    var props = __rest(_a, []);
    return (React.createElement("div", __assign({ ref: ref, role: "separator" }, props),
        React.createElement(DashIcon, null)));
});
InputOTPSeparator.displayName = "InputOTPSeparator";
export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
