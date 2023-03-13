import classes from "./data/classes2.json";
import { CLassTree } from "./ClassTree";
import inherits from "./data/extendsclass.json";
import interfaces from "./data/interface.json"

const tree = new CLassTree()

const tuples = classes["#select"]["tuples"]
for (let i = 0;i < tuples.length; i++) {
    const tuple = tuples[i]
    const name = tuple[0]["label"]
    const pack = tuple[1]
    tree.add(name,pack,"class")
}
const tuplesI = interfaces["#select"]["tuples"]
for (let i = 0;i < tuplesI.length; i++) {
    const tuple = tuplesI[i]
    const name = tuple[0]["label"]
    const pack = tuple[1]
    tree.add(name,pack,"interface")
}
console.log(tree)
const inheritsTuples = inherits["#select"]["tuples"]
for (let i = 0; i < inheritsTuples.length; i++){
    const inheritsTuple = inheritsTuples[i]
    const from = inheritsTuple[0]
    const to = inheritsTuple[1]
    console.log(from,to)
    tree.addDependency(from,to,"inheritance")
}

export {tree}