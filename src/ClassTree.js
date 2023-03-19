import { JavaClass } from "./JavaClass"
import { JavaPackage } from "./JavaPackage"

export class CLassTree{
    constructor() {
        this.root = new JavaPackage("src","")
    }

    add(name, pack, type, linesOfCode){
        const node = new JavaClass(name, pack, type,linesOfCode)

        if (!this.root) {
            this.root = node
            return
        }

        let current = this.root
        let packages = pack.split(".")
        console.log(packages)
        //handle edge case if class and subpackage have same name
        for (let i = 0; i < packages.length-1; i++){
            if (i == 0)
                if (current.children.has(packages[i]))
                    current = current.children.get(packages[i])
                else {
                    const newNode = new JavaPackage(packages[i],packages[i])
                    current.children.set(newNode.pack,newNode)
                    current = newNode
                }
            else {
                if (current.children.has(current.pack+"."+packages[i]))
                    current = current.children.get(current.pack+"."+packages[i])
                else{
                    const newNode = new JavaPackage(packages[i],current?.pack+"."+packages[i])
                    current.children.set(newNode.pack,newNode)
                    current = newNode
                }
            }


        }
        current.children.set(pack,node)
    }

    contains(name, pack, isPack){
        let current = this.root

        let packages = pack.split(".")

        for (let i = 0; i < packages.length; i++){
            if (isPack) {
                if (i === packages.length-1){
                    return current.children.has(name)
                }
            }
            current = current.children.get(packages[i])
            if (current == null) return false
        }

        if (!isPack){
            return current.children.has(name)
        }
    }

    addDependency(from, to, dependencyType){
        const lastIndex = from.lastIndexOf(".")

        const fromPackage = from.slice(0, lastIndex)

        const fromName = from.slice(lastIndex + 1)

        let packages = fromPackage.split(".")

        let current = this.root

        for (let i = 0; i < packages.length; i++){
            if (i == 0) current = current.children.get(packages[i])
            else current = current.children.get(current.pack+"."+packages[i])
            if (current == undefined) return
        }
        let fromNode = current.children.get(from)
        if (dependencyType == "inheritance") fromNode.classInherits.add(to)
        else if (dependencyType == "invokation") fromNode.classInvokation.add(to)
        else if (dependencyType == "implementation") fromNode.classImplements.add(to)
    }
    getAllLeavesRec(node, leaves){
        if (node.children.size > 0){
            for (let value of node.children.values()){
                if (value instanceof JavaClass) leaves.push(value)
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
    getTopLevelPackages(){
        console.log([...this.root.children.values()])
        return [...this.root.children.values()]
    }
    //by level maybe??
    //get leaves in package

    //get children of package name
    getPackageContent(pack){
        let current = this.root
        let packages = pack.split(".")
        console.log("packis"+pack)
        console.log(current)
        for (let i = 0; i < packages.length; i++){
            console.log(packages[i])
            if (i == 0) current = current.children.get(packages[i])
            else current = current.children.get(current.pack+"."+packages[i])
            console.log("heylooo")
            console.log(current)
        }
        console.log(current)

        return [...current.children.values()]
    }

    getNode(node){
        let current = this.root

        let packages = node.split(".")

        for (let i = 0; i < packages.length; i++){
            if (i == 0) current = current.children.get(packages[i])
            if (current.children.has(current.pack+"."+packages[i]))
                current = current.children.get(current.pack+"."+packages[i])
            else if (current.children.has(node))
                current = current.children.get(node)
        }
        return current
    }

}