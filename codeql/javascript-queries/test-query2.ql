/**
 * @kind problem
 * @id your-query-id
 */
import javascript

from ImportDeclaration id
where id.getImportedPath().getValue() = "react"
select id, "New Test string"