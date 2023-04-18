import { ClassTree } from "./ClassTree";

import Classes from "../data/Class.json";
import Interfaces from "../data/Interface.json"
import Implementations from "../data/Implementations.json";
import Extensions from "../data/Extensions.json";
import Initializations from "../data/Initialization.json"
import Instantiations from "../data/Instantiation.json"
import GenericInitializations from "../data/GenericInitialization.json"
import GenericInstantiations from "../data/GenericInstantiation.json"

const tree = new ClassTree()

const classTuples = Classes["#select"]["tuples"]
for (let i = 0; i < classTuples.length; i++) {
    const tuple = classTuples[i]
    const name = tuple[0]

    if (name === "") continue;

    const pack = tuple[1]
    const lines = tuple[2]
    tree.add(name,pack,"class",lines)
}

const interfaceTuples = Interfaces["#select"]["tuples"]
for (let i = 0;i < interfaceTuples.length; i++) {
    const tuple = interfaceTuples[i]
    const name = tuple[0]

    if (name === "") continue;

    const pack = tuple[1]
    const lines = tuple[2]
    tree.add(name,pack,"interface",lines)
}

const implementsTuples = Implementations["#select"]["tuples"]
for (let i = 0; i < implementsTuples.length; i++){
    const implementTuple = implementsTuples[i]
    let from = implementTuple[0]
    const to = implementTuple[1]

    if (from.endsWith("<>")) from = from.substring(0, from.length - 2)
    if (from.endsWith(".")) continue;

    tree.addDependency(from,to,"implementation")
}

const extensionTuples = Extensions["#select"]["tuples"]
for (let i = 0; i < extensionTuples.length; i++){
    const inheritTuple = extensionTuples[i]
    let from = inheritTuple[0]
    const to = inheritTuple[1]
    if (from.endsWith("<>")) from = from.substring(0, from.length - 2)
    if (from.endsWith(".")) continue;

    tree.addDependency(from,to,"inheritance")
}

const initializationTuples = Initializations["#select"]["tuples"]
for (let i = 0; i < initializationTuples.length; i++){
    const iniTuple = initializationTuples[i]
    let from = iniTuple[0]
    const to = iniTuple[1]

    if (from.endsWith("<>")) from = from.substring(0, from.length - 2)
    if (from.endsWith(".")) continue;

    tree.addDependency(from,to,"invokation")
}

const genericInitializationTuple = GenericInitializations["#select"]["tuples"]
for (let i = 0; i < genericInitializationTuple.length; i++){
    const genIniTuple = genericInitializationTuple[i]
    let from = genIniTuple[0]
    const to = genIniTuple[1]

    if (from.endsWith("<>")) from = from.substring(0, from.length - 2)
    if (from.endsWith(".")) continue;

    tree.addDependency(from,to,"invokation")
}

const instantiationTuples = Instantiations["#select"]["tuples"]
for (let i = 0; i < instantiationTuples.length; i++){
    const instTuple = instantiationTuples[i]
    let from = instTuple[0]
    const to = instTuple[1]

    if (from.endsWith("<>")) from = from.substring(0, from.length - 2)
    if (from.endsWith(".")) continue;

    tree.addDependency(from,to,"invokation")
}
const genericInstantiationTuples = GenericInstantiations["#select"]["tuples"]
for (let i = 0; i < genericInstantiationTuples.length; i++){
    const genInstTuple = genericInstantiationTuples[i]
    let from = genInstTuple[0]
    const to = genInstTuple[1]

    if (from.endsWith("<>")) from = from.substring(0, from.length - 2)
    if (from.endsWith(".")) continue;

    tree.addDependency(from,to,"invokation")
}
tree.calculateLinesOfCodeRecursively(tree.root);
tree.createJSONTreeRecursively(tree.root);
export {tree}