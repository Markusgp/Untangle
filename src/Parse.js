import classes from "./data/class.json";
import { CLassTree } from "./ClassTree";
import inherits from "./data/extendsclass.json";
import interfaces from "./data/interface.json"
import initialization from "./data/initialization.json"


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
// const inheritsTuples = inherits["#select"]["tuples"]
// for (let i = 0; i < inheritsTuples.length; i++){
//     const inheritsTuple = inheritsTuples[i]
//     const from = inheritsTuple[0]
//     const to = inheritsTuple[1]
//     tree.addDependency(from,to,"inheritance")
// }

const initializationTuple = initialization["#select"]["tuples"]
for (let i = 0; i < initializationTuple.length; i++){
    const iniTuple = initializationTuple[i]
    const from = iniTuple[0]
    const to = iniTuple[1]
    tree.addDependency(from,to,"invokation")
}



export {tree}