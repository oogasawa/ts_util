
import * as fs from "fs";
import lineByLine from "n-readlines";
import objectPath from "object-path";
import { sprintf } from "sprintf-js";

const origFilePath = "_sidebar.orig.md";


class Section {
    sectionName: string;
    level1: string;
    level2: string[];

    constructor() { }

    getLevel1(): string[] {
        return [this.level1];
    }

    getLevel2(): string[] {
        let result: string[] = [];
        result.push(this.level1);
        for (let l2 of this.level2) {
            result.push(l2);
        }
        return result;
    }
}

// -----


export function publish_docsify_sidebars() {

    const origData: Section[] = parse_orig_file();
    let section: Section;

    console.log(origData);

    // for main _sidebar.md
    const mainSidebar: string = get_sidebar(origData);
    console.log(mainSidebar);
    fs.writeFileSync("_sidebar.md", mainSidebar, { encoding: "utf-8" });


    // for subdirectories.
    for (section of origData) {
        let sectionStr: string = get_section_sidebar(origData, section);
        let outfile: string = section.sectionName + "/_sidebar.md";
        fs.writeFileSync(outfile, sectionStr, { encoding: "utf-8" });
    }


}


function get_sidebar(origData: Section[]): string {
    let result: string[] = [];

    result.push("<!-- docs/_sidebar.md -->");
    result.push("");
    result.push("* [Home](/)");


    for (let s of origData) {
        result.push("");
        result = result.concat(s.getLevel1());
    }

    return result.join("\n");
}

function get_section_sidebar(origData: Section[], section: Section): string {

    let result: string[] = [];

    result.push("<!-- docs/_sidebar.md -->");
    result.push("");
    result.push("* [Home](/)");


    for (let s of origData) {
        if (s.sectionName === section.sectionName) {
            result = result.concat(s.getLevel2());
        }
        else {
            result.push("");
            result = result.concat(s.getLevel1());
        }
    }

    return result.join("\n");
}


function parse_orig_file(): Section[] {

    let result: Section[] = [];
    let section: Section = new Section();

    const liner = new lineByLine(origFilePath);

    const pLevel1 = /^\* \[([0-9]+)\. (.+)/;
    const pLevel2 = /^\* \[&nbsp;.+/;

    let line: false | Buffer;

    while (line = liner.next()) {

        let m = pLevel1.exec(line.toString());
        if (m !== null) { // matched!

            if (objectPath.has(section, "level1")) {
                result.push(section);
                section = new Section();
            }

            objectPath.set(section, "level1", m[0]);
            objectPath.set(section, "sectionName", sprintf("section%02d", parseInt(m[1])));
            continue;
        }

        m = pLevel2.exec(line.toString());
        if (m !== null) { // matched!
            objectPath.push(section, "level2", m[0]);
            continue;
        }

    }

    result.push(section);
    return result;
}


