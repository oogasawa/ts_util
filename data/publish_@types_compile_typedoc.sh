
cat <<EOF > typedoc.json
{
  "inputFiles": ["./node_modules/{{{packageName}}}"],
  "mode": "{{mode}}",
  "out": "typedoc",
  "includeDeclarations": true,
  "excludeExternals": true
}
EOF


typedoc --options typedoc.json
