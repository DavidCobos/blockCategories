import React, {useState, useEffect} from 'react'
import getCategories from './Categoria.service'
import { useCssHandles } from 'vtex.css-handles'
import { categoryResponse } from './typings/categories'
import './Categorias.css'

interface CategoriaProps {}

const CSS_HANDLES = ['categoriasView']

const Categorias: StorefrontFunctionComponent<CategoriaProps> = ({}) => {

  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelected] = useState(0)
  const [selectedCategoryName, setSelectedName] = useState('')

  const selectCategory = (id:number, nombre:string) => {
    setSelected(id)
    setSelectedName(nombre)
  }

  const handles = useCssHandles(CSS_HANDLES)

  useEffect(() => {
    getCategories(selectedCategory).then((data:any) => setCategories(data.categorias) ).catch(() => console.log("Error getCategories"))
  },[selectedCategory])

  let breadcrumb;
  if (selectedCategory > 0) {
    breadcrumb =  <span>familias / {selectedCategoryName}</span>;
  } else {
    breadcrumb = <span>familias</span>;
  }

  return (
    <div>
      <h2>
        Categoria
      </h2>

      {breadcrumb}

      <div className='flex flex-wrap justify-around'>
        {categories.map((val:categoryResponse) => (
          <div onClick={() => selectCategory(val.id, val.nombre)} key={val.id} className={`${handles.categoriasView} flex flex-column mv7 mr2 ba b--black-10 shadow-1`}>
              <img src={val.imageUrl} className="" />
              <span className="tc">{val.nombre}</span>
          </div>
        ))}
      </div>

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
