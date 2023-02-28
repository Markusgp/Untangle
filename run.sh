if [ ! "$2" = "skipDatabase" ]
then
  if [ ! -d "database-$1}" ]
  then
    codeql database create codeql-database-$1 --language=$1 --overwrite --threads=0
  else
    codeql database create codeql-database-$1 --language=$1
  fi
fi
codeql database run-queries codeql-database-$1
echo "Interpreting results"
dir=$(pwd)
datapath2=$dir\\codeql-database-$1\\results\\codeql\\java
k=1
for i in "$datapath2"/*.bqrs
do
  path=$(cut -d "." -f 1 <<< "$i")
  queryFile=$(echo ${path##*/})
  codeql bqrs decode "$i" -o=results\\$queryFile.json --format=json
  k=$(($k + 1))
done
npm start
$SHELL