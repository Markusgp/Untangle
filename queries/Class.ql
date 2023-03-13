/**
 * @name Class
 * @id java/example/class
 * @description Gets all classess as well as their qualified module
 * @kind problem
 * @problem.severity warning

 */
import java

//TODO: remove javafx classes from query
from Class c
where c.getCompilationUnit().fromSource()
select c.getName(), c.getPackage() + "." + c.getName(), c.getNumberOfLinesOfCode()