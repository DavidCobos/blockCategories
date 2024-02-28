import React, {useState, useEffect} from 'react'
import getCategories from './Categoria.service'

interface CategoriaProps {}

const Categorias: StorefrontFunctionComponent<CategoriaProps> = ({}) => {

  const [categories, setCategories] = useState([])

  useEffect(() => {
    getCategories().then((data:any) => setCategories(data.categorias) ).catch(() => console.log("Error getCategories"))
  },[])

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

Categorias.schema = {
  title: 'editor.countdown.title',
  description: 'editor.countdown.description',
  type: 'object',
  properties: {},
}

export default Categorias
