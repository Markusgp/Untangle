/**
 * @name Interface
 * @kind problem
 * @problem.severity warning
 * @id java/example/empty-block
 */
import java

 from ClassOrInterface ci, ClassOrInterface i
 where i = ci.getASourceSupertype() and i.getCompilationUnit().fromSource()
 select ci.getPackage()+"."+ci+" Extends/implements "+i.getPackage()+"."+i,""