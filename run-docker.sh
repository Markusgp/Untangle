#!/bin/bash
codeql pack install
codeql pack add codeql/java-all
cd codeql/java-queries
codeql pack add codeql/java-all
cd ../..
if [ ! "$2" = "skipDatabase" ]
then
  if [ ! -d "codeql-database-$1}" ]
  then
    rm -rf codeql-database-$1
  fi
  codeql database create codeql-database-$1 --language=$1 --threads=0
fi
codeql database run-queries codeql-database-$1
echo "Interpreting results"
dir=$(pwd)
datapath2=$dir/codeql-database-$1/results/codeql/$1
mkdir -p codeql-data
for i in $datapath2/*.bqrs
do
  cutted=$(cut -d "." -f 1 <<< "$i")
  queryFile=$(echo ${cutted##*/})
  codeql bqrs decode "$i" -o=codeql-data/$queryFile.json --format=json
done
