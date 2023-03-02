/**
 * @name interface
 * @kind problem
 * @problem.severity warning
 * @id java/example/interface
 */
import java
//TODO: remove javafx classes from query
from Interface c
where c.getCompilationUnit().fromSource()
select c, c.getPackage(), c.getFile().getLocation()