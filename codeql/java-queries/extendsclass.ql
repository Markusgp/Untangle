/**
 * @name Classes that are extended (disregarding java source)
 * @id extends-classes
 * @description Detects all classes that extend within scope
 * @kind diagnostic
 * 
 */
import java

from Class c, Class superclass
where superclass = c.getASourceSupertype() and superclass.getCompilationUnit().fromSource()
select c.getFile().getLocation()+" "+c,superclass.getFile().getLocation()+" "+superclass
//select c.getPackage()+"."+c,superclass.getPackage()+"."+superclass