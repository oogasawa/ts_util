"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDeno = void 0;
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
const tsconfigJson = `
cat <<EOF > tsconfig.json
{
  "compilerOptions": {
    "allowJs": true,
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "inlineSourceMap": true,
    "isolatedModules": true,
    "jsx": "react",
    "lib": ["deno.window"],
    "module": "esnext",
    "strict": true,
    "target": "esnext",
    "useDefineForClassFields": true,
    "plugins": [
      {
        "name": "typescript-deno-plugin",
        "enable": true,
        "importmap": "import_map.json"
      }
    ]
  }
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
function initDeno() {
    console.log(dotGitIgnore);
    // console.log(tslintJson);
    console.log(tsconfigJson);
}
exports.initDeno = initDeno;
