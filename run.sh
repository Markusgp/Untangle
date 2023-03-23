#!/bin/bash
cp -r codeql $3
cp -r run.sh $3
cp -r qlpack.yml $3
cwd=$(pwd)
cd $3
codeql pack install
codeql pack add codeql/java-all
cd codeql/java-queries
codeql pack add codeql/java-all
cd ../..
if [ ! "$2" = "skipDatabase" ]
then
  if [ ! -d "database-$1}" ]
  then
    rm -r codeql-database-$1
  fi
  codeql database create codeql-database-$1 --language=$1 --threads=0
fi
codeql database run-queries codeql-database-$1
echo "Interpreting results"
dir=$(pwd)
datapath2=$dir\\codeql-database-$1\\results\\codeql\\$1
mkdir -p data
for i in "$datapath2"/*.bqrs
do
  path=$(cut -d "." -f 1 <<< "$i")
  queryFile=$(echo ${path##*/})
  codeql bqrs decode "$i" -o=data\\$queryFile.json --format=json
done
cp -r data $cwd/src
cd $cwd
npm start
$SHELL