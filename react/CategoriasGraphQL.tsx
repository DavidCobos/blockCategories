import React from 'react'
import { useQuery } from 'react-apollo'
import getCategory from './graphql/getCategory.graphql'

interface CategoriaGraphQLProps {}

const CategoriasGraphQL: StorefrontFunctionComponent<CategoriaGraphQLProps> = ({}) => {

  const { data, loading, error } = useQuery(getCategory, {
    variables: {
      level: "0"
    },
    ssr: false
  })

  if (loading) {
    return (
      <div>
        <span>Cargando...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <span>Error!</span>
      </div>
    )
  }

  const categories = data.getCategory

  return (
    <div>
      <h2>
        Categoria
      </h2>
      {categories.map((val:any) => (
        <div key={val.id} className={val.special ? "bg-gold" : "" }>
          <img src={val.imageUrl}/>
          <h3>{val.nombre}</h3>
        </div>
      ))}
    </div>
  )
}

CategoriasGraphQL.schema = {
  title: 'editor.sideboard.title',
  description: 'editor.sideboard.description',
  type: 'object',
  properties: {},
}

export default CategoriasGraphQL
