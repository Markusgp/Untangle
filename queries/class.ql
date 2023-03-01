/**
 * @name Class
 * @kind problem
 * @problem.severity warning
 * @id java/example/method-call
 */
import java
//TODO: remove javafx classes from query
from Class c
where c.getCompilationUnit().fromSource()
select c, c.getPackage(), c.getFile().getLocation()