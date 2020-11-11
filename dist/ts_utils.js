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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const yargs_1 = __importDefault(require("yargs"));
const init = __importStar(require("./lib/init"));
// import * as shelljs from "shelljs";
main();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const argv = yargs_1.default
            .command("publish_typedoc", "Copy typedoc files to the dest directory", (yargs) => {
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
            });
        })
            .command("init", "Initialize the package", (yargs) => {
            yargs
                .option('unit_test', {
                alias: 'u',
                describe: "Unit test framework",
                default: 'jest'
            });
        })
            .demandCommand()
            .help()
            .argv;
        const pkgName = get_package_name();
        // console.log(argv);
        if (argv._[0] === "publish_typedoc") {
            yield publish_typedoc(pkgName, argv.src, argv.dest);
        }
        else if (argv._[0] === "init") {
            switch (argv.unit_test) {
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
    });
}
/** Get package name from a package.json.
 */
function get_package_name() {
    const jsonObject = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    return jsonObject.name;
}
function publish_typedoc(pkgName, src, dest) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("rm -Rf " + src);
        console.log("npm run typedoc");
        try {
            // if dest/pkgName directory exists
            yield fs.promises.access(dest + "/" + pkgName);
            // remove dest/pkgName directory.
            console.log("rm -Rf " + dest + "/" + pkgName);
        }
        catch (error) { // the directory does not exist.
            // do nothing.
        }
        // copy directory.
        console.log(["cp -R ", src, dest + "/" + pkgName].join(" "));
    });
}
