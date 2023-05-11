/**
 * @name field access
 * @kind problem
 * @problem.severity warning
 * @id java/example/field-access
 */
import java

from ClassOrInterface c, FieldAccess fa, ClassOrInterface orig
where c.getCompilationUnit().fromSource() and c.contains(fa.getField()) and orig.contains(fa.getSite()) and c != orig
    and orig.getCompilationUnit().fromSource() and c.getCompilationUnit().fromSource()
select orig.getPackage()+"."+orig,c.getPackage()+"."+c