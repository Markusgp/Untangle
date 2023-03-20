/**
 * @name Class
 * @kind problem
 * @problem.severity warning
 * @description Get's all classess as well as their qualified module
 * @id java/example/classes
 */
import java
//TODO: remove javafx classes from query
from Class c
where c.getCompilationUnit().fromSource()
select c.getName(), c.getPackage() + "." + c.getName()