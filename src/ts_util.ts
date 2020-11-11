

import * as fs from "fs";
import yargs from "yargs";
import * as init from "./lib/init";
// import * as shelljs from "shelljs";

main();


async function main() {

    const argv = yargs
        .command("publish_typedoc", "Copy typedoc files to the dest directory",
            (yargs) => {
                yargs
                    .option('src', {
                        alias: 's',
                        describe: 'source directory',
                        default: './docs'
                    })
                    .option('dest', {
                        alias: 'd',
                        describe: "destination directory",
                        default: "/mnt/c/Users/oogas/Documents/typedoc"
                    })

            })
        .command("init", "Initialize the package",
            (yargs) => {
                yargs
                    .option('unit_test', {
                        alias: 'u',
                        describe: "Unit test framework",
                        default: 'jest'
                    })
            })
        .demandCommand()
        .help()
        .argv;


    const pkgName = get_package_name();
    // console.log(argv);

    if (argv._[0] === "publish_typedoc") {
        await publish_typedoc(pkgName, <string>argv.src, <string>argv.dest);
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


