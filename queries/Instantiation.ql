/**
 * @name Instantiation of types
 * @kind problem
 * @problem.severity warning
 * @id java/example/object-instantiation
 * @description gets left-hand side of variable declaration
 */

import java
import semmle.code.java.Generics

from VariableUpdate ass
where (not ass.getDestVar().getType() instanceof ParameterizedType and not ass.getDestVar().getType() instanceof RawType)
and ass.getDestVar().getType().fromSource() //- Comment to filter out java libraries

select ass.getEnclosingCallable().getDeclaringType().getPackage() + "." + ass.getEnclosingCallable().getDeclaringType(),
       ass.getDestVar().getType().getCompilationUnit().getPackage() + "." + ass.getDestVar().getType()
 
