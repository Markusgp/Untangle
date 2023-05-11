import { ClassTree } from "./ClassTree";

import Classes from "../codeql-data/Class.json";
import Interfaces from "../codeql-data/Interface.json"
import Implementations from "../codeql-data/Implementations.json";
import Extensions from "../codeql-data/Extensions.json";
import Initializations from "../codeql-data/Initialization.json"
import Instantiations from "../codeql-data/Instantiation.json"
import GenericInitializations from "../codeql-data/GenericInitialization.json"
import GenericInstantiations from "../codeql-data/GenericInstantiation.json"
import FieldAccess from "../codeql-data/FieldAccess.json"
import StaticMethodAccess from "../codeql-data/StaticMethodAccess.json"

import { CodeQLType } from "../Types/CodeQLType.js"

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

const fieldAccessTuples = FieldAccess["#select"]["tuples"]
addDependencyTuples(fieldAccessTuples, CodeQLType.Invocation);

const staticMethodAccessTuples = StaticMethodAccess["#select"]["tuples"]
addDependencyTuples(staticMethodAccessTuples, CodeQLType.Invocation);


tree.calculateLinesOfCodeRecursively(tree.root);
tree.createJSONTreeRecursively(tree.root);
export {tree}