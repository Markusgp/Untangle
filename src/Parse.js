import classes from "./data/classes2.json";
import { CLassTree } from "./ClassTree";
import inherits from "./data/extendsclass.json"

const tree = new CLassTree()

const tuples = classes["#select"]["tuples"]
for (let i = 0;i < tuples.length; i++) {
    const tuple = tuples[i]
    const name = tuple[0]["label"]
    const pack = tuple[1]
    tree.add(name,pack,true)
}
console.log(tree)
const inheritsTuples = inherits["#select"]["tuples"]
for (let i = 0; i < inheritsTuples.length; i++){
    const inheritsTuple = inheritsTuples[i]
    const from = inheritsTuple[0]
    const to = inheritsTuple[1]
    tree.addDependency(from,to)
}

export {tree}