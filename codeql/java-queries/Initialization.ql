/**
 * @name Initialization
 * @kind problem
 * @problem.severity warning
 * @id java/example/object-initialization
 * @description gets right-hand side of variable declaration / all constructor calls
 */

 import java
 import semmle.code.java.Generics

 string getRepresentation(RefType t) {
   result = t.getPackage() + "." + t.getName()
 }


 from ConstructorCall call
   //No circular constructor calls   
   where call.getCaller().getDeclaringType() != call.getCallee().getDeclaringType() 

   //No Generics parameterized or raw
   and (not call.getCallee().getDeclaringType() instanceof RawType and not call.getCallee().getDeclaringType() instanceof ParameterizedType)

  //Remove all super() constructor calls to Object() (or other source)
   and call.getCallee().getDeclaringType().fromSource() 

   //If we don't want super() calls at all uncomment this:
   //and (not call.callsSuper())

   select getRepresentation(call.getCaller().getDeclaringType()), 
          getRepresentation(call.getCallee().getDeclaringType())