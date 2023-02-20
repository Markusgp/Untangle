if [ ! -d "database-$1}" ]
then
  codeql database create database-$1 --language=$1 --overwrite --threads=0
else
  codeql database create database-$1 --language=$1
fi
codeql database analyze database-$1 --format=csv --output=results
cd database-$1\\results\\codeql\\$1-queries\\codeql\\$1-queries
codeql bqrs decode test-query.bqrs --format=json --output=test.csv
cd ..\\..\\..\\..\\..\\..
npm start
$SHELL