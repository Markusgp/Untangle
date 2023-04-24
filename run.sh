#!/bin/bash
cp -r codeql $2
cp -r qlpack.yml $2
cwd=$(pwd)
cd $2
codeql pack install
codeql pack add codeql/java-all
cd codeql/java-queries
codeql pack add codeql/java-all
cd ../..
if [ ! -d "database-$1}" ]
then
  rm -r codeql-database-$1
fi
codeql database create codeql-database-$1 --language=$1 --threads=0
codeql database run-queries codeql-database-$1
echo "Interpreting results"
dir=$(pwd)
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]
then
  datapath2=$dir\\codeql-database-$1\\results\\codeql\\$1
  mkdir -p codeql-data
  for i in "$datapath2"/*.bqrs
  do
    path=$(cut -d "." -f 1 <<< "$i")
    queryFile=$(echo ${path##*/})
    codeql bqrs decode "$i" -o=codeql-data\\$queryFile.json --format=json
  done
fi
if [[ "$OSTYPE" == "linux-gnu"* || "$OSTYPE" == "darwin"* ]]
then
  datapath2=$dir/codeql-database-$1/results/codeql/$1
  mkdir -p codeql-data
  for i in $datapath2/*.bqrs
  do
    cutted=$(cut -d "." -f 1 <<< "$i")
    queryFile=$(echo ${cutted##*/})
    codeql bqrs decode "$i" -o=codeql-data/$queryFile.json --format=json
  done
fi
cp -r codeql-data $cwd/src
cd $cwd
npm start
$SHELL