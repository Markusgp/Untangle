import { JavaClass } from "./JavaClass"
import { JavaPackage } from "./JavaPackage"
import { CodeQLType } from "../Types/CodeQLType"

export class ClassTree {
    constructor() {
        this.root = new JavaPackage("src","")
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

    getTopLevelPackages(){
        return [...this.root.children.values()]
    }

    //get children of package name
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

    getDependantNodes(node) {
        const dependantNodes = new Set();
        const targetNode = node;
    
        if (targetNode instanceof JavaClass) {
            const checkDependencies = (dependencySet) => {
                dependencySet.forEach(dependency => {
                    const dependantNode = dependency;
                    if (dependantNode && !dependantNodes.has(dependantNode)) {
                        dependantNodes.add(dependantNode);
                        checkDependencies(dependantNode.classInherits);
                        checkDependencies(dependantNode.classInvocation);
                        checkDependencies(dependantNode.classImplements);
                    }
                });
            };
    
            checkDependencies(targetNode.classInherits);
            checkDependencies(targetNode.classInvocation);
            checkDependencies(targetNode.classImplements);
        }
    
        return Array.from(dependantNodes);
    }
    
    getNotDependantNodes(node) {
        const allNodes = this.getAllLeaves();
        const dependantNodes = this.getDependantNodes(node);
        const dependantNodeSet = new Set(dependantNodes);
        dependantNodeSet.add(node);
    
        return allNodes.filter(leafNode => !dependantNodeSet.has(leafNode));
    }
    
    //TODO This method is never invoked is it redundant? @Markus?
    updateOpacityOnSelection(selectedNode) {
        const dependantNodes = this.getDependantNodes(selectedNode.id);
        const notDependantNodes = this.getNotDependantNodes(selectedNode.id);
        const updateOpacity = (nodes, alpha) => {
            nodes.forEach(node => {
                const foundNode = nodes.find(e => e.id === node.id);
                if (foundNode) foundNode.opacity = alpha;
            });
        };
        updateOpacity(dependantNodes, 1);
        updateOpacity(notDependantNodes, 0.5);
    }

    //TODO Unused method, can it be deleted? @Daniel?
    contains(pack){
        let current = this.root

        let packages = pack.split(".")

        for (let i = 0; i < packages.length; i++){
            if (i === packages.length-1){
                return current.children.has(pack)
            }
            if (i === 0) current = current.children.get(packages[i])
            else current = current.children.get(current.pack+"."+packages[i])
            if (current == null) return false
        }
    }
    
}