"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init_with_jest = exports.init_with_mocha = exports.init = void 0;
const dotGitIgnore = `

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
const mochaTsconfigJson = `
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
        "noImplicitAny": true,
		"removeComments": true,
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
const jestTsconfigJson = `
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
        "noImplicitAny": true,
		"removeComments": true,
		"sourceMap": true,
		"lib":[
			"es2020.string"
		],
		"types": [
			"jest",
			"node"
		]
	},
	"moduleResolution": "node"
}

EOF
`;
const tslintJson = `
cat << EOF > tslint.json
{
	"defaultSeverity": "error",
	"extends": [
		"tslint:recommended"
	],
	"jsRules": {},
	"rules": {
		"no-console": false,
		"max-classes-per-file": false
	},
	"rulesDirectory": []
}
EOF
`;
const dot_eslintrc = `
cat << EOF > .eslintrc
{
"root": true,
  "parser": "@typescript-eslint/parser",
  "plugins": [
"@typescript-eslint"
],
  "extends": [
"eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended"
]

}
`;
const gulpfileJs = `
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
const installTools = `

npm install --save @types/node
npm install --save-dev typescript @types/typescript ts-node
npm install --save-dev gulp gulp-cli gulp-typescript
npm install --save log4js
`;
const installMocha = `

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
const jestConfigJs = `
cat << EOF > jest.config.js
module.exports = {
  "roots": [
    "<rootDir>/test"
  ],
  "testMatch": [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  "transform": {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  verbose: true
}
EOF
`;
const installJest = `

mkdir -p src/lib test/lib

npm install --save-dev jest @types/jest ts-jest

cat << EOF
Edit package.json as follows

    ...
"bin": "./dist/YOURPACKAGE.js",
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
    console.log(dotGitIgnore);
    console.log(gulpfileJs);
    console.log(tslintJson);
    console.log(dot_eslintrc);
    console.log(installTools);
}
exports.init = init;
function init_with_mocha() {
    init();
    console.log(mochaTsconfigJson);
    console.log(installMocha);
}
exports.init_with_mocha = init_with_mocha;
function init_with_jest() {
    init();
    console.log(jestTsconfigJson);
    console.log(jestConfigJs);
    console.log(installJest);
}
exports.init_with_jest = init_with_jest;
