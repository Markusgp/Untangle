# Untangle
Untangle is a visualization tool for analyzing Java projects and its internal dependencies.  
It features no ads, tracking, cloud, server or data mining.

**Untangle is part of a research study - please fill out our [short survey](https://www.google.com) after trying out the tool. Thank you!**

## Untangle Capabilities
* View your project in either the *Circular* or *Force-directed* layouts.
* **Expand** and **collapse** packages to gain better insight into your project structure.
* **Highlight** edges pertaining to specific class / interface / package in your system.
* Control your view with **filtering** and **hiding** of unneeded elements.

![Example of execution](./Media/Untangle_Example.gif)



## Running _Untangle_
Untangle can be executed in a docker container **(recommended)** or locally.


## Running Untangle in Docker

### Prerequisites for running Untangle in Docker (recommended).
* A buildable maven or gradle Java project.
* Your project must be buildable with JDK 8, 11, 12, 13, 14, 15, or 16.
* [Docker](https://docs.docker.com/get-docker/) installed.

### Step-by-step guide

First make sure that both `docker-run.sh` and `run-docker.sh` scripts have executable permission.
Execute the following commands:
```
chmod +x ./docker-run.sh
chmod +x ./run-docker.sh
```
---
Create the docker image by executing:

```
docker build -f ${path-to-dockerfile} -t untangle .
```
Where `${path-to-dockerfile}` is either `Docker\DOCKERFILE` for Windows or `Docker/DOCKERFILE` for UNIX systems.

---

If you want to run the image without file sharing **(recommended)** run the following commands:
```
docker run -d -it -p 8080:3000 --name untangled untangle

cd ${path-to-project}

docker cp . untangled:/var/www
```
Where `${path-to-project}` refers to the path to the project you want analyzed with Untangle.

---

Now the container is set up for Untangle to run. To run Untangle execute the following command while specifying your java version
```
docker exec untangled /bin/bash -c "./docker-run.sh ${specified-java-version}"
```

For example if you want to run the app and your project is buildable in Java 15, you can run the following command:
```
docker exec untangled /bin/bash -c "./docker-run.sh 15"
```


## Running Untangle locally

### Prerequisites for running Untangle locally.
* A buildable maven or gradle Java project.
* Newest version of [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) installed.
* Newest version of [CodeQL CLI](https://codeql.github.com/docs/codeql-cli/getting-started-with-the-codeql-cli/) installed.
* Your Java project must be buildable on your local machine.

### Step-by-step guide

To run the app locally you can execute the ``run.sh`` script with some parameters:

```
./run.sh ${language} skipDatabase ${path-to-project}
```

1. `${language}` must be specified to `java`, as it is, for now, the only supported language.
2. `skipDatabase` is if you want to run the program again and the database is already set up from a previous run. If this is the case, simply just write `skipDatabase` as the second parameter. If not simply write anything but `skipDatabase` as the second parameter
3. `${path-to-project}` must be set to the path to the project that you want to analyze with Untangle.

