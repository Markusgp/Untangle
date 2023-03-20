/**
 * @name Object instantiation of outside class
 * @kind problem
 * @problem.severity warning
 * @id java/example/object-instantiation
 */

 import java

 from Class a, Class b, Callable c
 where c.calls(a.getAConstructor()) and a.getCompilationUnit().fromSource() and b.contains(c) and b != a
 select b.getFile().getLocation()+" "+b,a.getFile().getLocation()+" "+a
 //select b.getPackage()+"."+b,a.getPackage()+"."+a