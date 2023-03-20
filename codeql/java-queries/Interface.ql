/**
 * @name Interface
 * @kind problem
 * @problem.severity warning
 * @description Gets all interfaces
 * @id java/example/interface
 */
import java
from Interface c
where c.getCompilationUnit().fromSource()
select c, c.getPackage() + "." + c.getName()