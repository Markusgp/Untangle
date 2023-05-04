cp -r react-app/codeql var/www
cp -r react-app/run-docker.sh var/www
cp -r react-app/qlpack.yml var/www
export PATH="/opt/java/openjdk$1/bin:$PATH"
cd var/www
codeql pack install
find . -type f -exec dos2unix {} \;
./run-docker.sh java
if [ -z "$(ls -A codeql-data)" ]; then
  echo "CodeQL failed please check the used JDK version is the right one"
  exit 1
fi
cp -r codeql-data ../../react-app/src
rm -r codeql-data
cd ../../react-app
npm i
npm start