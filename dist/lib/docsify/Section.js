"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Section {
    constructor() {
        this.level2 = [];
    }
    getLevel1() {
        return [this.level1];
    }
    getLevel2() {
        const result = [];
        result.push(this.level1);
        for (const l2 of this.level2) {
            result.push(l2);
        }
        return result;
    }
}
exports.default = Section;
