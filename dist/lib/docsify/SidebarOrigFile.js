"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const Section_1 = __importDefault(require("./Section"));
const n_readlines_1 = __importDefault(require("n-readlines"));
const object_path_1 = __importDefault(require("object-path"));
const sprintf_js_1 = require("sprintf-js");
const origFilePath = "_sidebar.orig.md";
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
class SidebarOrigFile {
    generateMainSidebar(origData) {
        let result = [];
        result.push("<!-- docs/_sidebar.md -->");
        result.push("");
        result.push("* [Home](/)");
        for (const s of origData) {
            result.push("");
            result = result.concat(s.getLevel1());
        }
        return result.join("\n");
    }
    generateSectionSidebar(origData, section) {
        let result = [];
        result.push("<!-- docs/_sidebar.md -->");
        result.push("");
        result.push("* [Home](/)");
        for (const s of origData) {
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
    parseOrigFile() {
        const result = [];
        let section = new Section_1.default();
        const liner = new n_readlines_1.default(origFilePath);
        const pLevel1 = /^\* \[([0-9]+)\. (.+)/;
        const pLevel2 = /^\* \[&nbsp;.+/;
        let line;
        while (true) {
            line = liner.next();
            if (line === false) {
                break;
            }
            let m = pLevel1.exec(line.toString());
            if (m !== null) { // matched!
                if (object_path_1.default.has(section, "level1")) {
                    result.push(section);
                    section = new Section_1.default();
                }
                object_path_1.default.set(section, "level1", m[0]);
                object_path_1.default.set(section, "sectionName", sprintf_js_1.sprintf("section%02d", parseInt(m[1], 10)));
                continue;
            }
            m = pLevel2.exec(line.toString());
            if (m !== null) { // matched!
                object_path_1.default.push(section, "level2", m[0]);
                continue;
            }
        }
        result.push(section);
        return result;
    }
    publishSidebars() {
        const origData = this.parseOrigFile();
        let section;
        console.log(origData);
        // Generates main _sidebar.md
        const mainSidebar = this.generateMainSidebar(origData);
        console.log(mainSidebar);
        fs.writeFileSync("_sidebar.md", mainSidebar, { encoding: "utf-8" });
        // Generates _sidebar.md files in subdirectories.
        for (section of origData) {
            const sectionStr = this.generateSectionSidebar(origData, section);
            const outfile = section.sectionName + "/_sidebar.md";
            fs.writeFileSync(outfile, sectionStr, { encoding: "utf-8" });
        }
    }
}
exports.default = SidebarOrigFile;
