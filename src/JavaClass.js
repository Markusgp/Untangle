export class JavaClass {
    #classInvokes = new Set()
    #classInherits = new Set()
    #packageInvokes = new Set()
    #children = new Map()

    constructor(name, pack, leaf){
        this.name = name
        this.package = pack
        this.leaf = leaf
    }
    //make sure there is no duplicates
    set classInvokation(x){
        this.#classInvokes.add(x)
    }
    set classInherited(x){
        this.#classInherits.add(x)
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

    get all(){
        return this.#classInherits, this.#classInvokes, this.#packageInvokes
    }

    get classInvokation(){
        return this.#classInvokes
    }

    get classInherited(){
        return this.#classInherits
    }

    get packageInvokation(){
        return this.#packageInvokes
    }

}