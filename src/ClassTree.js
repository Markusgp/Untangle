import { JavaClass } from "./JavaClass"

export class CLassTree{
    constructor() {
        this.root = new JavaClass("src","src",false)
    }

    add(name, pack, leaf){
        const node = new JavaClass(name, pack, leaf)

        if (!this.root) {
            this.root = node
            return
        }

        let current = this.root

        let packages = pack.split(".")
        console.log(packages)
        //handle edge case if class and subpackage have same name
        for (let i = 0; i < packages.length; i++){
            if (current.children.has(packages[i]))
                current = current.children.get(packages[i])
            else{
                const newNode = new JavaClass(packages[i],current.package+"."+packages[i],false)
                console.log(newNode)
                current.children.set(packages[i],newNode)
                current = newNode
            }

        }
        current.children.set(name,node)
    }

    contains(name, pack, leaf){
        let current = this.root

        let packages = pack.split(".")

        for (let i = 0; i < packages.length; i++){
            if (!leaf) {
                if (i == packages.length-1){
                    return current.children.has(name)
                }
            }
            current = current.children.get(packages[i])
            if (current == null) return false
        }

        if (leaf){
            return current.children.has(name)
        }
    }

    addDependency(from, to){
        console.log(from)
        const lastIndex = from.lastIndexOf(".")

        const fromPackage = from.slice(0, lastIndex)

        const fromName = from.slice(lastIndex + 1)

        let packages = fromPackage.split(".")
        console.log(packages)

        let current = this.root
        console.log(current)

        for (let i = 0; i < packages.length; i++){
            current = current.children.get(packages[i])
            console.log(current)
            console.log(i)
            if (current == null) return
        }
        console.log(current)
        console.log(fromName)
        let fromNode = current.children.get(fromName)

        fromNode.classInvokation.add(to)
    }
    getAllLeavesRec(node, leaves){
        if (node.children.size > 0){
            for (let value of node.children.values()){
                if (value.leaf) leaves.push(value)
                else leaves.join(this.getAllLeavesRec(value,leaves))
            }
        }
        return leaves
    }
    getAllLeaves(){
        return this.getAllLeavesRec(this.root, [])
    }

    //get packages
    //toplevel packages
    //by level maybe??
    //get leaves in package

}