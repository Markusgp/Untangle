/**
 * @name Interface
 * @id java/example/interface
 * @description Gets all interfaces as well as their qualified module
 * @kind problem
 * @problem.severity warning

 */
import java

from Interface c
where c.getCompilationUnit().fromSource()
select c.getName(), c.getPackage() + "." + c.getName(), c.getNumberOfLinesOfCode()