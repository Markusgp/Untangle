# Untangle
Untangle is a visualization tool for analyzing Java projects and its internal dependencies.  
It features no ads, tracking, cloud, server or data mining.

**Untangle is part of a research study - please fill out our [short survey](https://docs.google.com/forms/d/e/1FAIpQLSdklKw3WTpTMkxsHGbBROVpRa4UMqqKAwNolv2vco42i0Tv8Q/viewform) after trying out the tool. Thank you!**

## Untangle Capabilities
* View your project in either the *Circular* or *Force-directed* layouts.
* **Expand** and **collapse** packages to gain better insight into your project structure.
* **Highlight** edges pertaining to specific class / interface / package in your system.
* Control your view with **filtering** and **hiding** of unneeded elements.

![Example of execution](./Media/Untangle_Example.gif)

## Running the app
There is currently 2 different ways to run the app. You can either run it [locally](#running-untangle-locally) or through [docker](#running-untangle-in-docker-recommended). How to run the app is described in later sections.

It is important to note the time it can take for the application to start. If you are creating the docker image for the first time this step usually takes around 5 minutes depending on the power of your pc.
And the codeql analysis for the first time can also take up to 5 minutes depending on the size of your project.
However after having installed the docker image or ran the application once, you can refer to the [Rerunning the app](#rerunning-the-app)

### Running Untangle in Docker *(recommended)*

#### Prerequisites for running Untangle in Docker.
* A buildable maven or gradle Java project.
* Your project must be buildable with JDK 8, 11, 12, 13, 14, 15, or 16.
* [Docker](https://docs.docker.com/get-docker/) installed.


#### Step-by-step guide

(FOR UNIX USERS): First make sure that both `docker-run.sh` and `run-docker.sh` scripts have executable permission.
Execute the following commands:
```
chmod +x ./docker-run.sh
chmod +x ./run-docker.sh
```
---
Create the docker image by executing the following command from the root directory:

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

### Running Untangle locally

#### Prerequisites for running Untangle locally.
* A buildable maven or gradle Java project.
* Installed version (16.0+) of [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) installed.
* Installed version of [CodeQL CLI](https://codeql.github.com/docs/codeql-cli/getting-started-with-the-codeql-cli/) installed.
* Your Java project must be buildable on your local machine.

#### Step-by-step guide
To run the app locally you can execute the ``run.sh`` script with some parameters:

```
./run.sh ${language} ${path-to-project}
```

1. `${language}` must be specified to `java`, as it is, for now, the only supported language.
2. `${path-to-project}` must be set to the path to the project that you want to analyze with Untangle.

### Rerunning the app
If you have already done an analysis on the project, and you wish to see the same data, you do not need to run the whole analysis again.

If you ran the application locally, you can simply use the `npm start` command and the application with the previous data should be displayed.

If you ran the application in docker, you need to run `docker exec untangled /bin/bash -c "cd react-app; npm start"`

### Note
If you are running the app locally these are the files/directories that will go in your source project
- qlpack.yml (codeql dependencies)
- codeql (codeql queries)
- codeql-database-java (the codeql database)

It is also worth to note that if something goes wrong, you might see some previous data from a prior execution, or the test data provided by us. Therefore, it is a good practice if you wish to run analysis on another project or an updated project, that you delete the contents of `src/codeql-data` to not get any mix-ups
