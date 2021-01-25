
import * as fs from "fs";
import yargs from "yargs";
import * as init from "./lib/init";
import { AtTypes } from "./lib/AtTypes";
import { publish_docsify_sidebars } from "./lib/Docsify";

main();


async function main() {

    const argv = yargs
        .command("publish_typedoc", "Copy typedoc files to the dest directory",
            (obj) => {
                obj.option('src', {
                    alias: 's',
                    describe: 'source directory',
                    default: './docs'
                }).option('dest', {
                    alias: 'd',
                    describe: "destination directory",
                    default: process.env["HOME"] + "/public_html/typedoc"
                })

            })
        .command("publish_@types", "Generate a TypeDoc from @types project",
            (obj) => {
                obj.option('base-dir', {
                    alias: 'b',
                    describe: 'base directory',
                    default: process.env["HOME"] + '/tmp'
                }).option('dest', {
                    alias: 'd',
                    describe: "destination directory",
                    default: process.env["HOME"] + "/public_html/typedoc/@types"
                }).option('package', {
                    alias: 'p',
                    describe: "package name",
                    default: "@types/node"
                })

            })
        .command("init", "Initialize the package",
            (y) => {
                y.option('unit_test', {
                    alias: 'u',
                    describe: "Unit test framework",
                    default: 'jest'
                })
            })
        .command("publish_docsify_sidebars", "Generate docsify _sidebar.md from the orig file.")
        .demandCommand()
        .help()
        .argv;



    // console.log(argv);

    if (argv._[0] === "publish_typedoc") {
        const pkgName = get_package_name();
        await publish_typedoc(pkgName, argv.src as string, argv.dest as string);
    }
    else if (argv._[0] === "publish_@types") {
        const atTypes = new AtTypes();
        atTypes.publish(argv.package as string, argv["base-dir"] as string, argv.dest as string);
    }
    else if (argv._[0] === "publish_docsify_sidebars") {
        publish_docsify_sidebars();
    }
    else if (argv._[0] === "init") {
        switch (<string>argv.unit_test) {
            case "jest":
                init.init_with_jest();
                break;
            case "mocha":
                init.init_with_mocha();
                break;
            default:
                break;
        }

    }

}


/** Get package name from a package.json.
 */
function get_package_name() {
    const jsonObject = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    return jsonObject.name;
}



async function publish_typedoc(pkgName: string, src: string, dest: string): Promise<void> {

    console.log("rm -Rf " + src);
    console.log("npm run typedoc");
    try {
        // if dest/pkgName directory exists
        await fs.promises.access(dest + "/" + pkgName);
        // remove dest/pkgName directory.
        console.log("rm -Rf " + dest + "/" + pkgName);

    } catch (error) { // the directory does not exist.
        // do nothing.
    }
    // copy directory.
    console.log(["cp -R ", src, dest + "/" + pkgName].join(" "));
}


