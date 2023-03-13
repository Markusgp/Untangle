/**
 * @name Extensions
 * @id java/example/extensions
 * @description Detects all classes that extend within scope
 * @kind problem
 * @problem.severity warning
 */
import java

boolean isGeneric(ClassOrInterface pt) {
    if (pt instanceof ParameterizedType) then result = true
    else result = false
}

  string getRepresentation(ClassOrInterface c) {
    if (isGeneric(c) = false) then result = c.getPackage() + "." + c
    else if (isGeneric(c) = true) then result = c.getPackage().toString() + "." + c.(ParameterizedType).getGenericType()
    else result = "Something went wrong"
}

from ClassOrInterface c, Class superclass
where superclass = c.getASourceSupertype() and superclass.getCompilationUnit().fromSource() 
      and (not getRepresentation(c) = getRepresentation(superclass)) //Tuple<K,V> is derived from Tuple
select getRepresentation(c), getRepresentation(superclass)        