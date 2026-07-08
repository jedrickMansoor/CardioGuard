"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUserId = void 0;
// GENERATE USER ID WITHOUT DOT
const generateUserId = (role) => {
    const prefixMap = {
        admin: "ADM",
        patient: "PAT",
        doctor: "DOC",
    };
    const prefix = prefixMap[role] || "GUS";
    const uniquePart = (Date.now() + Math.floor(Math.random() * 1e6)).toString(36);
    return `${prefix}-${uniquePart}`;
};
exports.generateUserId = generateUserId;
