
mkdir -p /home/oogasawa/tmp/empty_project
cd /home/oogasawa/tmp/empty_project
npm init -y
cat <<EOF > typedoc.json
{
    "inputFiles": ["./node_modules/@types/node/"],
    "mode": "modules",
    "out": "typedoc",
    "includeDeclarations": true,
    "excludeExternals": true
}
EOF
            
npm install --save @types/node
typedoc

            
