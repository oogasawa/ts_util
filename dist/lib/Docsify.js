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
exports.publish_sidebars = void 0;
const fs = __importStar(require("fs"));
const n_readlines_1 = __importDefault(require("n-readlines"));
const object_path_1 = __importDefault(require("object-path"));
const sprintf_js_1 = require("sprintf-js");
const origFilePath = "_sidebar.orig.md";
/** Section data of `_sidebar.md`.
 * It is assumed that the _sidebar.orig.md has the following format.
 * ```
 * <!-- docs/_sidebar.md -->
 *
 * * [HOME](/)
 * * [1.MySQLのセットアップ](section01/slide000/doc000.md)
 *
 * * [2. mysqlプラグインの使い方](section02/slide000/doc000.md)
 * * [&nbsp;&nbsp;&nbsp;&nbsp;2.1. パッケージの選択](section02/slide010/doc000.md)
 * * [&nbsp;&nbsp;&nbsp;&nbsp;2.2. パッケージのAPIマニュアルの生成](section020/slide020/doc000.md)
 *
 * * [3.PorgreSQLについて](section03/p2021_0220_PG00/doc.md)
 * ```
 */
class Section {
    // constructor() { }
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
// -----
function publish_sidebars() {
    const origData = parse_orig_file();
    let section;
    console.log(origData);
    // Generates main _sidebar.md
    const mainSidebar = get_sidebar(origData);
    console.log(mainSidebar);
    fs.writeFileSync("_sidebar.md", mainSidebar, { encoding: "utf-8" });
    // Generates _sidebar.md files in subdirectories.
    for (section of origData) {
        let sectionStr = get_section_sidebar(origData, section);
        let outfile = section.sectionName + "/_sidebar.md";
        fs.writeFileSync(outfile, sectionStr, { encoding: "utf-8" });
    }
}
exports.publish_sidebars = publish_sidebars;
function get_sidebar(origData) {
    let result = [];
    result.push("<!-- docs/_sidebar.md -->");
    result.push("");
    result.push("* [Home](/)");
    for (let s of origData) {
        result.push("");
        result = result.concat(s.getLevel1());
    }
    return result.join("\n");
}
function get_section_sidebar(origData, section) {
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
function parse_orig_file() {
    const result = [];
    let section = new Section();
    const liner = new n_readlines_1.default(origFilePath);
    const pLevel1 = /^\* \[([0-9]+)\. (.+)/;
    const pLevel2 = /^\* \[&nbsp;.+/;
    let line;
    while (line = liner.next()) {
        let m = pLevel1.exec(line.toString());
        if (m !== null) { // matched!
            if (object_path_1.default.has(section, "level1")) {
                result.push(section);
                section = new Section();
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
