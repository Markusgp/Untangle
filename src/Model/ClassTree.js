import { JavaClass } from "./JavaClass"
import { JavaPackage } from "./JavaPackage"
import { CodeQLType } from "../Types/CodeQLType"

export class ClassTree {
    constructor() {
        this.root = new JavaPackage("src","")
        this.maxDepend = 0
    }

    add(name, pack, type, linesOfCode){
        const node = new JavaClass(name, pack, type, linesOfCode);

        if (!this.root) {
            this.root = node;
            return
        }

        let current = this.root
        let packages = pack.split(".")
        for (let i = 0; i < packages.length-1; i++){
            if (i === 0)
                if (current.children.has(packages[i]))
                    current = current.children.get(packages[i])
                else {
                    const newNode = new JavaPackage(packages[i], packages[i])
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

    calculateLinesOfCodeRecursively(node) {
        if (node.children.size > 0) {
            let sum = Array.from(node.children.values()).reduce((acc, val) => acc + this.calculateLinesOfCodeRecursively(val), 0);
            node.linesOfCode = sum;
            return sum;
        } else {
            return node.linesOfCode;
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

    getMaxDependencies(){
        if(this.maxDepend !== 0) {
            return this.maxDepend
        }
        let nodes = this.getAllLeaves()
        let max = 0
        for (let i = 0; i < nodes.length; i++){
            let current = nodes[i]
            let numInvocations = current.classInvocation.size
            let numInheritances = current.classInherits.size
            let numImplementations = current.classImplements.size
            let sum = numInvocations+numInheritances+numImplementations
            if (sum > max) max = sum
        }
        return max
    }

    createJSONTreeRecursively(node) {
        if (node.children.size > 0) {
            let tmpJsonArr = [];
            let children = Array.from(node.children.values());
            for (let i = 0; i < children.length; i++) {
                let tmp = this.createJSONTreeRecursively(children[i]);
                tmpJsonArr.push(tmp);
            }
            let jsonRep = {'name': node.name, 'children' :  tmpJsonArr};
            node.jsonRep = jsonRep;
            return jsonRep;
        } else {
            let jsonRep = {"name": node.name, "value": node.linesOfCode};
            node.jsonRep = jsonRep;
            return jsonRep;
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
            if (i === 0) current = current.children.get(packages[i])
            else current = current.children.get(current.pack+"."+packages[i])
            if (current === undefined) return
            tempTo = ""
            for (let j = 0; j < toPackages.length; j++){
                tempTo += toPackages[j]
                if (!tempTo.startsWith(current.pack) && !current.pack.startsWith(tempTo)){
                    if (dependencyType === CodeQLType.Inheritance) current.classInherits.add(tempTo)
                    else if (dependencyType === CodeQLType.Invocation) current.classInvocation.add(tempTo)
                    else if (dependencyType === CodeQLType.Implementation) current.classImplements.add(tempTo)
                }
                tempTo += "."
            }
        }
        let fromNode = current.children.get(from)

        tempTo = ""
        for (let i = 0; i < toPackages.length; i++){
            if (dependencyType === CodeQLType.Inheritance) fromNode.classInherits.add(tempTo+toPackages[i]);
            else if (dependencyType === CodeQLType.Invocation) fromNode.classInvocation.add(tempTo+toPackages[i]);
            else if (dependencyType === CodeQLType.Implementation) fromNode.classImplements.add(tempTo+toPackages[i]);
            tempTo = tempTo + toPackages[i]+"."
        }
    }

    getTopLevelPackages(){
        return [...this.root.children.values()]
    }

    getPackageContent(pack){
        let current = this.root
        let packages = pack.split(".")
        for (let i = 0; i < packages.length; i++){
            if (i === 0) current = current.children.get(packages[i])
            else current = current.children.get(current.pack+"."+packages[i])
        }
        return [...current.children.values()]
    }

    getNode(node){
        let current = this.root

        let packages = node.split(".")

        for (let i = 0; i < packages.length; i++){
            if (i === 0) current = current.children.get(packages[i])
            if (current.children.has(current.pack+"."+packages[i]))
                current = current.children.get(current.pack+"."+packages[i])
            else if (current.children.has(node))
                current = current.children.get(node)
        }
        return current
    }

    getNumDependenciesRec(node,targetNode,type){
        let numInvocations = 0
        targetNode.children.forEach(child => {
            if (child instanceof JavaClass) {
                if (type === "invocation") if (node.classInvocation.has(child.pack)) numInvocations += 1
                else if (type === "implementation") if (node.classImplements.has(child.pack)) numInvocations += 1
                else if (type === "inheritence") if (node.classInherits.has(child.pack)) numInvocations += 1
            }
            else {
                numInvocations += this.getNumDependenciesRec(node,child,type)
            }
        })
        return numInvocations
    }

    getNumDependencies(node,targetNode,type){
        let current = this.getNode(node)
        let target = this.getNode(targetNode)
        if (target instanceof JavaClass) return 1

        return this.getNumDependenciesRec(current,target,type)
    }

    getNumInvocations(node){
        let current = this.getNode(node)
        let numInvocations = current.classInvocation.size
        current.children.forEach(child => {
            if (child instanceof JavaClass) numInvocations += child.classInvocation.size
        })
        return numInvocations
    }

    getNumInheritances(node){
        let current = this.getNode(node)
        let numInheritances = current.classInherits.size
        current.children.forEach(child => {
            if (child instanceof JavaClass) numInheritances += child.classInherits.size
        })
        return numInheritances
    }

    getNumImplementations(node){
        let current = this.getNode(node)
        let numImplementations = current.classImplements.size
        current.children.forEach(child => {
            if (child instanceof JavaClass) numImplementations += child.classImplements.size
        })
        return numImplementations
    }
}