
import * as fs from "fs";
import * as child_process from "child_process";
import { Readable, Transform } from "stream";
import MersenneTwister from "mersenne-twister";
import { sprintf } from "sprintf-js";
import Mustache from "mustache";
import objectPath from "object-path";


/** `@types` related procedures.
 *
 *
 */
export class AtTypes {

    rng: MersenneTwister;

    emptyProject: string;

    packageCreationShellScriptTemplate: string;

    typedocCompilationShellScriptTemplate: string;

    constructor() {
        this.rng = new MersenneTwister();
        const d = new Date();
        this.emptyProject = sprintf("empty_project%04d%02d%02d_%02d%02d%02d_%05d",
            d.getFullYear(), d.getMonth() + 1, d.getDate(),
            d.getHours(), d.getMinutes(), d.getSeconds(),
            this.rng.random_int() % 100000);

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
    isPkg(): boolean {
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
    publish(packageName: string, baseDir: string, destDir: string) {
        this.createEmptyProject(baseDir, packageName);
        this.compileTypedoc(baseDir);
        this.copyDirectory(destDir);
        this.removeEmptyProject();
    }



    createEmptyProject(baseDir: string, packageName: string) {

        let params = {};
        objectPath.set(params, "baseDir", baseDir);
        objectPath.set(params, "emptyProject", this.emptyProject);
        objectPath.set(params, "packageName", packageName);

        const templateStr: Buffer = fs.readFileSync(this.packageCreationShellScriptTemplate);
        const initCommands: string = Mustache.render(templateStr.toString(), params);
        fs.writeFileSync("", initCommands); // 
        console.log(initCommands);
    }



    compileTypedoc(baseDir: string) {
        let params = {};
        objectPath.set(params, "mode", this.determineMode(baseDir));

        const templateStr: Buffer = fs.readFileSync(this.packageCreationShellScriptTemplate);
        const initCommands: string = Mustache.render(templateStr.toString(), params);
        console.log(initCommands);

    }


    determineMode(baseDir: string): string {
        const emptyProjectDir = baseDir + "/" + this.emptyProject;

        console.log(emptyProjectDir);
        let defCounter = 0;
        // let tsCounter = 0;
        child_process
            .execSync("find ./ -name '*.ts'",
                {
                    cwd: emptyProjectDir,
                    shell: "/bin/bash"
                })
            .toString()
            .split("\n")
            .forEach((line: string) => {
                if (line.endsWith(".d.ts")) {
                    defCounter++;
                }
                // else if (line.endsWith(".ts")) {
                //    tsCounter++;
                //}
            })


        if (defCounter <= 1) {
            return "file";
        }
        else {
            return "modules";
        }

    }


    copyDirectory(destDir: string) {

    }

    removeEmptyProject() {

    }

}
