
import * as fs from "fs";
import Section from "./Section";
import lineByLine from "n-readlines";
import objectPath from "object-path";
import { sprintf } from "sprintf-js";




/** This SidebarOrigFile class represents the data structure of `_sidebar.orig.md` file.
 *
 * Docsify uses a series of `_sidebar.md` files in the project root directory and in each section directory.
 * To make `_sidebar.md` be consistent with each other, 
 * `publish_sidebars()` method generates all the `_sidebar.md` files from a special file `_sidebar.orig.md`.
 *
 * 
 * It is assumed that the `_sidebar.orig.md` has the following format.
 * ```
 * <!-- docs/_sidebar.md -->
 *
 * * [HOME](/)
 * * [1.Setting up MySQL](section01/slide000/doc000.md)
 *
 * * [2. How to use mysql in typescript](section02/slide000/doc000.md)
 * * [&nbsp;&nbsp;&nbsp;&nbsp;2.1. Selecting packages](section02/slide010/doc000.md)
 * * [&nbsp;&nbsp;&nbsp;&nbsp;2.2. Generating API manual of the package](section020/slide020/doc000.md)
 *
 * * [3. PorgreSQL](section03/p2021_0220_PG00/doc.md)
 * ```
 */

export default class SidebarOrigFile {

    origFilePath: string;

    sections: Section[];

    constructor() {
        this.origFilePath = "_sidebar.orig.md";
        this.sections = [];
    }


    generateMainSidebar(): string[] {
        let result: string[] = [];

        result.push("<!-- docs/_sidebar.md -->");
        result.push("");
        result.push("* [Home](/)");


        for (const s of this.sections) {
            result.push("");
            result = result.concat(s.getLevel1());
        }

        // return result.join("\n");
        return result;
    }



    generateSectionSidebar(section: Section): string[] {

        let result: string[] = [];

        result.push("<!-- docs/_sidebar.md -->");
        result.push("");
        result.push("* [Home](/)");


        for (const s of this.sections) {
            if (s.sectionName === section.sectionName) {
                result = result.concat(s.getLevel2());
            }
            else {
                result.push("");
                result = result.concat(s.getLevel1());
            }
        }
        // console.log("# generateSectionSidebar");
        // console.log(result);
        // console.log("# --- generateSectionSidebar");
        // return result.join("\n");
        return result;
    }



    parseOrigFile(): void {

        let section: Section = new Section();

        const liner = new lineByLine(this.origFilePath);

        const pLevel1 = /^\* \[([0-9]+)\.\s*(.+)/;
        const pLevel2 = /^\* \[&nbsp;.+/;

        let line: false | Buffer;
        while (true) {
            line = liner.next();
            // console.log("line: " + line.toString());
            if (line === false) { break }

            let m = pLevel1.exec(line.toString());
            if (m !== null) { // matched!
                if (objectPath.has(section, "level1")) {
                    this.sections.push(section);
                    section = new Section();
                }

                objectPath.set(section, "level1", m[0]);
                objectPath.set(section, "sectionName", sprintf("section%02d", parseInt(m[1], 10)));
                continue;
            }

            m = pLevel2.exec(line.toString());
            if (m !== null) { // matched!
                objectPath.push(section, "level2", m[0]);
                continue;
            }

        }

        this.sections.push(section);
    }




    publishSidebars() {

        // Generates main _sidebar.md
        const mainSidebar: string = this.generateMainSidebar().join("\n");
        console.log(this.sections);
        // console.log(mainSidebar);
        fs.writeFileSync("_sidebar.md", mainSidebar, { encoding: "utf-8" });


        // Generates _sidebar.md files in subdirectories.
        let section: Section;
        for (section of this.sections) {
            const sectionStr: string = this.generateSectionSidebar(section).join("\n");
            const outfile: string = section.sectionName + "/_sidebar.md";
            fs.writeFileSync(outfile, sectionStr, { encoding: "utf-8" });
        }


    }


}
