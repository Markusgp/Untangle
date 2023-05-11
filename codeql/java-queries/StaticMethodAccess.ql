/**
 * @name Static method call from outside class
 * @kind problem
 * @problem.severity warning
 * @id java/example/static-method-call
 */

 import java


 from StaticMethodAccess sma, Callable callee, Callable caller, ClassOrInterface orig, ClassOrInterface called
 where sma.getCallee() = callee and sma.getCaller() = caller 
     and orig.contains(caller) and called.contains(callee) and orig != called and callee != caller
     and orig.getCompilationUnit().fromSource() and called.getCompilationUnit().fromSource()
 select orig.getPackage()+"."+orig,called.getPackage()+"."+called
 