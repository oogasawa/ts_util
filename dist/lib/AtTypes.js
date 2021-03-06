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
exports.AtTypes = void 0;
const fs = __importStar(require("fs"));
const child_process = __importStar(require("child_process"));
const mersenne_twister_1 = __importDefault(require("mersenne-twister"));
const sprintf_js_1 = require("sprintf-js");
const mustache_1 = __importDefault(require("mustache"));
const object_path_1 = __importDefault(require("object-path"));
/** `@types` related procedures.
 *
 *
 */
class AtTypes {
    constructor() {
        this.rng = new mersenne_twister_1.default();
        const d = new Date();
        this.emptyProject = sprintf_js_1.sprintf("empty_project%04d%02d%02d_%02d%02d%02d_%05d", d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), this.rng.random_int() % 100000);
        if (this.isPkg()) {
            this.packageCreationShellScriptTemplate = "/snapshot/ts_util/data/publish_@types_create_project.sh";
            this.typedocCompilationShellScriptTemplate = "/snapshot/ts_util/data/publish_@types_compile_typedoc.sh";
        }
        else {
            this.packageCreationShellScriptTemplate = "data/publish_@types_create_project.sh";
            this.typedocCompilationShellScriptTemplate = "data/publish_@types_compile_typedoc.sh";
        }
    }
    /** Checks if this module is called from a binary package created by pkg or not.
     *
     *  If this module is called from a pkg-ed binary, `process.argv` will be as follows:
     *
     *  ```
     *  $ ts_util publish_@types -p comedy
     *  [
     *     '/home/oogasawa/local/bin/ts_util',
     *     '/snapshot/ts_util/dist/ts_util.js',
     *     'publish_@types',
     *     '-p',
     *     'comedy'
     *   ]
     * ```
     */
    isPkg() {
        // console.log(process.argv);
        if (process.argv.length >= 2 && process.argv[1] === "/snapshot/ts_util/dist/ts_util.js") {
            return true;
        }
        else {
            return false;
        }
    }
    /** Publish a specified @types/package typedoc.
     *
     * 1. Creates an empty project,
     * 2. Installs the given @types/package from the npm repository into the empty project
     * 3. compiles the downloaded @types/package with typedoc
     * 4. publishes the result HTML pages to the specified directory.
     *
     * @param packageName
     * @param baseDir
     * @param destDir
     */
    publish(packageName, baseDir, destDir) {
        this.createEmptyProject(baseDir, packageName);
        this.compileTypedoc(baseDir);
        this.copyDirectory(destDir);
        this.removeEmptyProject();
    }
    createEmptyProject(baseDir, packageName) {
        let params = {};
        object_path_1.default.set(params, "baseDir", baseDir);
        object_path_1.default.set(params, "emptyProject", this.emptyProject);
        object_path_1.default.set(params, "packageName", packageName);
        const templateStr = fs.readFileSync(this.packageCreationShellScriptTemplate);
        const initCommands = mustache_1.default.render(templateStr.toString(), params);
        fs.writeFileSync("", initCommands); // 
        console.log(initCommands);
    }
    compileTypedoc(baseDir) {
        let params = {};
        object_path_1.default.set(params, "mode", this.determineMode(baseDir));
        const templateStr = fs.readFileSync(this.packageCreationShellScriptTemplate);
        const initCommands = mustache_1.default.render(templateStr.toString(), params);
        console.log(initCommands);
    }
    determineMode(baseDir) {
        const emptyProjectDir = baseDir + "/" + this.emptyProject;
        console.log(emptyProjectDir);
        let defCounter = 0;
        // let tsCounter = 0;
        child_process
            .execSync("find ./ -name '*.ts'", {
            cwd: emptyProjectDir,
            shell: "/bin/bash"
        })
            .toString()
            .split("\n")
            .forEach((line) => {
            if (line.endsWith(".d.ts")) {
                defCounter++;
            }
            // else if (line.endsWith(".ts")) {
            //    tsCounter++;
            //}
        });
        if (defCounter <= 1) {
            return "file";
        }
        else {
            return "modules";
        }
    }
    copyDirectory(destDir) {
    }
    removeEmptyProject() {
    }
}
exports.AtTypes = AtTypes;
