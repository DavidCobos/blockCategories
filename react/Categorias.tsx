import React, {useState, useEffect} from 'react'
import getCategories from './Categoria.service'
import { useCssHandles } from 'vtex.css-handles'
import { categoryResponse } from './typings/categories'
import { IconHome, IconCaret } from 'vtex.store-icons'
import './Categorias.css'

interface CategoriaProps {}

const CSS_HANDLES = ['cardCV', 'imageCV','textCV', 'headerCV', 'descriptionCV', 'breadcrumbCV']

const Categorias: StorefrontFunctionComponent<CategoriaProps> = ({}) => {

  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelected] = useState(0)
  const [selectedCategoryName, setSelectedName] = useState('')

  const selectCategory = (id:number, nombre:string, url:string) => {

    if (selectedCategory > 0) {
      window.location.href = url.replace('https://privarsa.vtexcommercestable.com.br', 'https://privarsa.myvtex.com');
    }else{
      setSelected(id)
      setSelectedName(nombre)
    }
  }

  const handles = useCssHandles(CSS_HANDLES)

  useEffect(() => {
    getCategories(selectedCategory).then((data:any) => setCategories(data.categorias) ).catch(() => console.log("Error getCategories"))
  },[selectedCategory])

  let breadcrumb, header, description;

  if (selectedCategory > 0) {
    breadcrumb =  <span className='flex ml7'> <IconHome /> <p className={`${handles.breadcrumbCV}`}>familias</p> <IconCaret/> <p className={`${handles.breadcrumbCV}`}>&gt; {selectedCategoryName}</p> </span> ;
    header = <h2 className={`${handles.headerCV} mt3 tc`}>{selectedCategoryName}</h2>;
    description =  <h3 className={`${handles.descriptionCV} mt3 tc`}> Descripcion de familia</h3>;
  } else {
    breadcrumb = <span className='flex ml7'> <IconHome /> <p className={`${handles.breadcrumbCV}`}>familias</p> </span> ;
    header =  <h2 className={`${handles.headerCV} mt3 tc`}> Privarsa</h2>;
    description = <p className={`${handles.descriptionCV} mt3 tc`}>Descripcion de familia</p>;
  }

  return (
    <div className='mt7'>

      {breadcrumb}
      {header}
      <hr></hr>
      {description}

      <div className='flex flex-wrap justify-center'>
        {categories.map((val:categoryResponse) => (
          <div onClick={() => selectCategory(val.id, val.nombre, val.url)} key={val.id} className={`${handles.cardCV} flex flex-column mv7 mh5 ba b--black-10 shadow-1`}>
              <img src={val.imageUrl} className={`${handles.imageCV} mt7`} />
              <span className={`${handles.textCV} mt5 tc`} >{val.nombre}</span>
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
