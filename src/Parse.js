import classes from "./data/class.json";
import { CLassTree } from "./ClassTree";
import implementations from "./data/implementations.json";
import inherits from "./data/extentions.json";
import interfaces from "./data/interface.json"
import initialization from "./data/initialization.json"
import genericInitialization from "./data/genericInitalization.json"
import instantioation from "./data/instantioation.json"
import genericInstantioation from "./data/genericInstantiation.json"

const tree = new CLassTree()

const tuplesC = classes["#select"]["tuples"]
for (let i = 0;i < tuplesC.length; i++) {
    const tuple = tuplesC[i]
    const name = tuple[0]
    const pack = tuple[1]
    const lines = tuple[2]
    tree.add(name,pack,"class",lines)
}
const tuplesI = interfaces["#select"]["tuples"]
for (let i = 0;i < tuplesI.length; i++) {
    const tuple = tuplesI[i]
    const name = tuple[0]
    const pack = tuple[1]
    const lines = tuple[2]
    tree.add(name,pack,"interface",lines)
}
console.log(tree)
const implementsTuples = implementations["#select"]["tuples"]
for (let i = 0; i < implementsTuples.length; i++){
    const implementTuple = implementsTuples[i]
    const from = implementTuple[0]
    const to = implementTuple[1]
    tree.addDependency(from,to,"implementation")
}

const inheritTuples = inherits["#select"]["tuples"]
for (let i = 0; i < inheritTuples.length; i++){
    const inheritTuple = inheritTuples[i]
    const from = inheritTuple[0]
    const to = inheritTuple[1]
    tree.addDependency(from,to,"inheritance")
}

const initializationTuple = initialization["#select"]["tuples"]
for (let i = 0; i < initializationTuple.length; i++){
    const iniTuple = initializationTuple[i]
    const from = iniTuple[0]
    const to = iniTuple[1]
    tree.addDependency(from,to,"invokation")
}
const genericInitializationTuple = initialization["#select"]["tuples"]
for (let i = 0; i < genericInitializationTuple.length; i++){
    const genIniTuple = genericInitializationTuple[i]
    const from = genIniTuple[0]
    const to = genIniTuple[1]
    tree.addDependency(from,to,"invokation")
}

const instantioationTuple = instantioation["#select"]["tuples"]
for (let i = 0; i < instantioationTuple.length; i++){
    const instTuple = instantioationTuple[i]
    const from = instTuple[0]
    const to = instTuple[1]
    tree.addDependency(from,to,"invokation")
}
const genericInstantioationTuple = genericInstantioation["#select"]["tuples"]
for (let i = 0; i < genericInstantioationTuple.length; i++){
    const genInstTuple = genericInstantioationTuple[i]
    const from = genInstTuple[0]
    const to = genInstTuple[1]
    tree.addDependency(from,to,"invokation")
}
console.log(tree)
export {tree}