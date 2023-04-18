import { ClassTree } from "./ClassTree";

import Classes from "../data/Class.json";
import Interfaces from "../data/Interface.json"
import Implementations from "../data/Implementations.json";
import Extensions from "../data/Extensions.json";
import Initializations from "../data/Initialization.json"
import Instantiations from "../data/Instantiation.json"
import GenericInitializations from "../data/GenericInitialization.json"
import GenericInstantiations from "../data/GenericInstantiation.json"

import { CodeQLType } from "./CodeQLType.js"

const tree = new ClassTree()

function addDefinitionsTuples(tuples, type) {
    for (let i = 0; i < tuples.length; i++) {
        const tuple = tuples[i];
        const name = tuple[0];
        if (name === "") continue;
        const pack = tuple[1];
        const lines = tuple[2];
        tree.add(name,pack,type,lines);
    }
}

function addDependencyTuples(tuples, type) {
    for (let i = 0; i < tuples.length; i++) {
        const tuple = tuples[i];
        let from = tuple[0];
        let to = tuple[1];
        if (from.endsWith("<>")) from = from.substring(0, from.length - 2);
        if (from.endsWith(".")) continue;
        tree.addDependency(from,to,type);
    }
}


const classTuples = Classes["#select"]["tuples"]
addDefinitionsTuples(classTuples, CodeQLType.Class);

const interfaceTuples = Interfaces["#select"]["tuples"]
addDefinitionsTuples(interfaceTuples, CodeQLType.Interface);

const implementsTuples = Implementations["#select"]["tuples"]
addDependencyTuples(implementsTuples, CodeQLType.Implementation);

const extensionTuples = Extensions["#select"]["tuples"]
addDependencyTuples(extensionTuples, CodeQLType.Inheritance);

const initializationTuples = Initializations["#select"]["tuples"]
addDependencyTuples(initializationTuples, CodeQLType.Invocation);

const genericInitializationTuples = GenericInitializations["#select"]["tuples"]
addDependencyTuples(genericInitializationTuples, CodeQLType.Invocation);

const instantiationTuples = Instantiations["#select"]["tuples"]
addDependencyTuples(instantiationTuples, CodeQLType.Invocation);

const genericInstantiationTuples = GenericInstantiations["#select"]["tuples"]
addDependencyTuples(genericInstantiationTuples, CodeQLType.Invocation);

tree.calculateLinesOfCodeRecursively(tree.root);
tree.createJSONTreeRecursively(tree.root);
export {tree}