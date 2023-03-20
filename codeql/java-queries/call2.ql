/**
 * @name Method call from outside class
 * @kind problem
 * @problem.severity warning
 * @id java/example/method-call
 */

 import java

 from Callable caller, Callable callee, ClassOrInterface orig, ClassOrInterface called
 where caller.calls(callee) and callee.getCompilationUnit().fromSource()
       and orig.contains(caller) and called.contains(callee) 
       //this doesn't seem to work don't know why
       and not orig.getPackage().toString().matches("javafx.*")
       and not called.getPackage().toString().matches("javafx.*")
//select orig.getFile().getLocation()+"**"+orig,called.getFile().getLocation()+"**"+called
select orig.getPackage()+"."+orig+" "+caller,called.getPackage()+"."+called+" "+callee