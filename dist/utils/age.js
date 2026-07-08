"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAgeFromDOB = void 0;
const getAgeFromDOB = (dateOfBirth) => {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }
    return age;
};
exports.getAgeFromDOB = getAgeFromDOB;
