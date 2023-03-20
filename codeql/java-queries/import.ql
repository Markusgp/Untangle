/**
 * @name Import statement2
 * @kind problem
 * @problem.severity warning
 * @id java/example/import-statement2
 */
 
 import java

 from Import imp
 where imp.getCompilationUnit().fromSource()
 select imp.getFile(), imp