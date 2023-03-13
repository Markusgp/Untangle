/**
 * @name Initialization of generic types
 * @kind problem
 * @problem.severity warning
 * @id java/example/object-initialization-generic
 * @description gets right-hand side of variable declarations (constructor) - when type is generic including all nested parameterized types
 */

import java
import semmle.code.java.Generics

boolean isGeneric(ClassOrInterface pt) {
  if (pt instanceof ParameterizedType) then result = true
  else result = false
}
 
string getRepresentation(ClassOrInterface c) {
  if (isGeneric(c) = false) then result = c.getPackage() + "." + c.getName()
  else if (isGeneric(c) = true) then result = c.getPackage().toString() + "." + c.(ParameterizedType).getGenericType().getName()
  else result = "Something went wrong"
}


from ConstructorCall call, ParameterizedType generic, ClassOrInterface child
//No circular constructor calls   
where call.getCaller().getDeclaringType() != call.getCallee().getDeclaringType() 
      //Check for generics and all nested children
      and call.getCallee().getDeclaringType() = generic and generic.getATypeArgument*() = child
   
      //Remove all generics that are tied to java
      and child.getSourceDeclaration().fromSource()  

      //If we don't want super() calls at all uncomment this:
      //and (not call.callsSuper())

select getRepresentation(call.getCaller().getDeclaringType()), 
       getRepresentation(child)