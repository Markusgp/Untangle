cp -r react-app/codeql var/www
cp -r react-app/run-docker.sh var/www
cp -r react-app/qlpack.yml var/www
export PATH="/opt/java/openjdk$1/bin:$PATH"
cd var/www
codeql pack install
find . -type f -exec dos2unix {} \;
./run-docker.sh java
cp -r codeql-data ../../react-app/src
cd ../../react-app
npm start