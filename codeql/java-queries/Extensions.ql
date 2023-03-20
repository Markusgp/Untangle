/**
 * @name Extensions
 * @id java/example/extensions
 * @description Detects all classes that extend within scope
 * @kind problem
 * @problem.severity warning
 */
import java

from ClassOrInterface c, ClassOrInterface superclass
where superclass = c.getASourceSupertype() and superclass.getCompilationUnit().fromSource()
select c.getPackage() + "." +c.getName(), superclass.getPackage() + "." + superclass.getName()