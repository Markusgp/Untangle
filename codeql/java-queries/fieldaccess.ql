/**
 * @name field access
 * @kind problem
 * @problem.severity warning
 * @id java/example/field-access
 */
import java

from Class c, FieldAccess fa, ClassOrInterface orig
where c.getCompilationUnit().fromSource() and c.contains(fa.getField()) and orig.contains(fa.getSite()) and c != orig
select orig.getFile().getLocation()+" "+orig,c.getFile().getLocation()+" "+c
//select orig.getPackage()+"."+orig,c.getPackage()+"."+c