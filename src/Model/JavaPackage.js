export class JavaPackage {
    #classInvokes = new Set()
    #classInherits = new Set()
    #classImplements = new Set()
    #children = new Map()

    constructor(name, pack){
        this.name = name
        this.pack = pack
        this.type = "package"
        this.visible = true
        this.jsonRep = null;
    }

    set classInvocation(x) { this.#classInvokes.add(x) }
    set classInherits(x) { this.#classInherits.add(x) }
    set classImplements(x) { this.#classImplements.add(x) }
    set children(x) { this.#children.add(x) }

    get children() { return this.#children }
    get classInvocation() { return this.#classInvokes }
    get classInherits(){ return this.#classInherits }
    get classImplements() { return this.#classImplements }

}