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

    contains(pack){
        let current = this.root

        let packages = pack.split(".")

        for (let i = 0; i < packages.length; i++){
            if (i === packages.length-1){
                 return current.children.has(pack)
            }
            if (i == 0) current = current.children.get(packages[i])
            else current = current.children.get(current.pack+"."+packages[i])
            if (current == null) return false
        }


    }

    addDependency(from, to, dependencyType){
        const lastIndex = from.lastIndexOf(".")

        const fromPackage = from.slice(0, lastIndex)

        let packages = fromPackage.split(".")

        let current = this.root
        let tempTo = ""
        let toPackages = to.split(".")

        for (let i = 0; i < packages.length; i++){
            if (i == 0) current = current.children.get(packages[i])
            else current = current.children.get(current.pack+"."+packages[i])
            if (current == undefined) return
            tempTo = ""
            for (let j = 0; j < toPackages.length; j++){
                tempTo += toPackages[j]
                if (!tempTo.startsWith(current.pack) && !current.pack.startsWith(tempTo)){
                    console.log("paseed the if with",current.pack,tempTo)
                    if (dependencyType == "inheritance") current.classInherits.add(tempTo)
                    else if (dependencyType == "invokation") current.classInvokation.add(tempTo)
                    else if (dependencyType == "implementation") current.classImplements.add(tempTo)
                }
                tempTo += "."
            }
        }
        let fromNode = current.children.get(from)

        tempTo = ""
        for (let i = 0; i < toPackages.length; i++){
            if (dependencyType == "inheritance") fromNode.classInherits.add(tempTo+toPackages[i])
            else if (dependencyType == "invokation") fromNode.classInvokation.add(tempTo+toPackages[i])
            else if (dependencyType == "implementation") fromNode.classImplements.add(tempTo+toPackages[i])
            tempTo = tempTo + toPackages[i]+"."
        }

        
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
        for (let i = 0; i < packages.length; i++){
            if (i == 0) current = current.children.get(packages[i])
            else current = current.children.get(current.pack+"."+packages[i])
        }

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