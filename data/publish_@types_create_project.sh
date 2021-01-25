
mkdir -p {{{baseDir}}}/{{{emptyProject}}}
cd {{{baseDir}}}/{{{emptyProject}}}
npm init -y
npm install --save @types/node
npm install --save {{{packageName}}}

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
			"esnext",
			"es2020.string"
		],
		"types": [
			"node"
		]
	},
	"moduleResolution": "node"
}
EOF


