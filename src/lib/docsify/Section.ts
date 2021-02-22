

export default class Section {
    sectionName: string;
    level1: string;
    level2: string[];

    constructor() {
        this.level2 = [];
    }

    getLevel1(): string[] {
        return [this.level1];
    }

    getLevel2(): string[] {
        const result: string[] = [];
        result.push(this.level1);
        for (const l2 of this.level2) {
            result.push(l2);
        }
        return result;
    }
}
