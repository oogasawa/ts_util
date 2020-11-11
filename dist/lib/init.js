"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init_with_jest = exports.init_with_mocha = exports.init = void 0;
const dot_git_ignore = `

cat <<EOF > .gitignore

######################
## node.js/typescript
######################

*~
package-lock.json
yarn.lock
node_modules/
*-linux
*-macos
*-win.exe

EOF
`;
const tsconfig_json = `
cat <<EOF > tsconfig.json

{
	"include": [
		"src/**/*"
	],
	"exclude": [
		"dist/**/*",
		"node_modules",
		"test/**/*"
	],
	"compilerOptions": {
		"target": "es6",
		"module": "commonJS",
		"esModuleInterop": true,
		"downlevelIteration": true,
		"removeComments": false,
		"preserveConstEnums": true,
		"sourceMap": true,
		"lib":[
			"es2020.string"
		],
		"types": [
			"mocha",
			"node"
		]
	},
	"moduleResolution": "node"
}

EOF
`;
const gulpfile_js = `
cat << EOF > gulpfile.js
var gulp = require('gulp');
var ts = require('gulp-typescript');

var tsProject = ts.createProject('tsconfig.json');

gulp.task('default', function() {
    return gulp.src('src/**/*.ts')
        .pipe(tsProject())
        .pipe(gulp.dest('dist'));
});

EOF
`;
const install_tools = `

npm install --save @types/node
npm install --save-dev typescript @types/typescript ts-node
npm install --save-dev gulp gulp-cli gulp-typescript
npm install --save log4js
`;
const install_mocha = `

mkdir -p src/lib test/lib

npm install --save -dev mocha @types/mocha 
npm install --save -dev chai @types/chai 

cat << EOF
Edit package.json as follows

    ...
"bin": "./dist/YOUR_PACKAGE_NAME.js"
"main": "./dist/lib/index.js",
"types": "./src/lib/index.ts",
"scripts": {
    "build": "npx gulp",
    "typedoc": "npx typedoc  --out docs src",
    "test": "npx mocha -r ts-node/register test/**/*.spec.ts"
},
    ...
EOF

`;
const jest_config_js = `
cat << EOF > jest.config.js
module.exports = {
  "roots": [
    "<rootDir>/src"
  ],
  "testMatch": [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  "transform": {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
}
EOF
`;
const install_jest = `

mkdir -p src/lib test/lib

npm install --save-dev jest @types/jest ts-jest

cat << EOF
Edit package.json as follows

    ...
"main": "./dist/lib/index.js",
"types": "./src/lib/index.ts",
"scripts": {
    "build": "npx gulp",
    "typedoc": "npx typedoc  --out docs src",
    "test": "jest"
},
"test": "jest",

    ...
EOF

`;
function init() {
    console.log(dot_git_ignore);
    console.log(tsconfig_json);
    console.log(gulpfile_js);
    console.log(install_tools);
}
exports.init = init;
function init_with_mocha() {
    init();
    console.log(install_mocha);
}
exports.init_with_mocha = init_with_mocha;
function init_with_jest() {
    init();
    console.log(jest_config_js);
    console.log(install_jest);
}
exports.init_with_jest = init_with_jest;
