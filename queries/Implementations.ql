/**
 * @name Implementations
 * @id java/example/implementations
 * @description Gets all implementations within scope
 * @kind problem
 * @problem.severity warning
 */
import java

from ClassOrInterface c, Interface superclass
where superclass = c.getASourceSupertype() and superclass.getCompilationUnit().fromSource()
select c.getPackage() + "." +c.getName(), superclass.getPackage() + "." + superclass.getName()