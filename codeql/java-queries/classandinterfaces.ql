/**
 * @name Class and Interface
 * @kind problem
 * @problem.severity warning
 * @id java/example/class-interface
 */
import java
//TODO: remove javafx classes from query
from ClassOrInterface c
where c.getCompilationUnit().fromSource()
select c, c.getPackage(), c.getFile().getLocation()