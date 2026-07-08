"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDayName = void 0;
const getDayName = (dateStr) => {
    const daysOfWeek = [
        "sun",
        "mon",
        "tue",
        "wed",
        "thu",
        "fri",
        "sat",
    ];
    const date = new Date(dateStr);
    return daysOfWeek[date.getDay()];
};
exports.getDayName = getDayName;
