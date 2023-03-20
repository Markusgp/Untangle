/**
 * @name Instantiation of generic types 
 * @kind problem
 * @problem.severity warning
 * @id java/example/object-instantiation-generic
 * @description gets left-hand side of variable declarations - when type is generic including all nested parameterized types
 */

import java
import semmle.code.java.Generics

boolean isGeneric(ClassOrInterface pt) {
    if (pt instanceof ParameterizedType) then result = true
    else result = false
}

string getRepresentation(ClassOrInterface c) {
    if (isGeneric(c) = false) then result = c.getPackage() + "." + c
    else if (isGeneric(c) = true) then result = c.getPackage().toString() + "." + c.(ParameterizedType).getGenericType()
    else result = "Something went wrong"
}

from VariableUpdate ass, ParameterizedType generic, ClassOrInterface child
where ass.getDestVar().getType() = generic and generic.getATypeArgument*() = child
and child.fromSource() //- Comment to filter out java libraries

select getRepresentation(ass.getEnclosingCallable().getDeclaringType()), 
       getRepresentation(child)