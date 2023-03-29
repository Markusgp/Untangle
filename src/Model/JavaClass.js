export class JavaClass {
    #classInvokes = new Set()
    #classInherits = new Set()
    #classImplements = new Set()
    #packageInvokes = new Set()
    #children = new Map()
    

    constructor(name, pack, type, linesOfCode){
        this.name = name
        this.pack = pack
        this.type = type
        this.linesOfCode = linesOfCode
        this.visible = true
    }
    //make sure there is no duplicates
    set classInvokation(x){
        this.#classInvokes.add(x)
    }
    set classInherits(x){
        this.#classInherits.add(x)
    }
    set classImplements(x){
        this.classImplements.add(x)
    }
    set packageInvokation(x){
        this.#packageInvokes.add(x)
    }
    set children(x){
        this.#children.add(x)
    }
    get children(){
        return this.#children
    }

    get classInvokation(){
        return this.#classInvokes
    }

    get classInherits(){
        return this.#classInherits
    }
    get classImplements(){
        return this.#classImplements
    }

    get packageInvokation(){
        return this.#packageInvokes
    }

}