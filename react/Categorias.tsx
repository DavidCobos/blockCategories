import React, {useState, useEffect} from 'react'
import getCategories from './Categoria.service'
import { useCssHandles } from 'vtex.css-handles'
import { categoryResponse } from './typings/categories'
import { IconHome } from 'vtex.store-icons'
import './Categorias.css'

interface CategoriaProps {
  itemsLarge: number
}

const CSS_HANDLES = ['cardCV', 'imageCV','textCV', 'headerCV', 'descriptionCV', 'breadcrumbCV']

const Categorias: StorefrontFunctionComponent<CategoriaProps> = ({itemsLarge}) => {

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
    breadcrumb =  <span className='flex ml7'><span className={`${handles.breadcrumbCV} flex`} onClick={() => setSelected(0)}><IconHome /> <p className='pl2 ma0 pt1'>Familias</p></span>  <span className={`${handles.breadcrumbCV} flex`}> <p className='pl2 ma0 pt1'>&gt; {selectedCategoryName}</p> </span> </span> ;
    header = <h2 className={`${handles.headerCV} mt3 tc`}>{selectedCategoryName}</h2>;
    description =  <h3 className={`${handles.descriptionCV} mt3 tc`}> Descripción de familia</h3>;
  } else {
    breadcrumb = <span className='flex ml7'> <span className={`${handles.breadcrumbCV} flex`} onClick={() => setSelected(0)}><IconHome/> <p className='pl2 ma0 pt1'>Familias</p></span> </span> ;
    header =  <h2 className={`${handles.headerCV} mt3 tc`}> Privarsa</h2>;
    description = <p className={`${handles.descriptionCV} mt3 tc`}>Descripción de familia</p>;
  }

  let decena = 100 / itemsLarge
  if (decena != 25){
    decena = decena - (decena%10)
  }
  const numeroLarge = decena.toString()

  console.log(itemsLarge)
  console.log(numeroLarge)

  return (
    <div className='mt7'>

      {breadcrumb}
      {header}
      <hr></hr>
      {description}

      {/* <div className='flex flex-wrap justify-center'>
        {categories.map((val:categoryResponse) => (
          <div onClick={() => selectCategory(val.id, val.nombre, val.url)} key={val.id} className={`${handles.cardCV} flex flex-column mv7 mh5 ba b--black-10 shadow-1`}>
              <img src={val.imageUrl} className={`${handles.imageCV} mt7`} />
              <h5 className={`${handles.textCV} mt5 tc`} >{val.nombre}</h5>
          </div>
        ))}
      </div> */}

      <div className='flex flex-wrap'>
        {categories.map((val:categoryResponse) => (
          <div key={val.id} className={`w-${numeroLarge}-ns`}>
            <div onClick={() => selectCategory(val.id, val.nombre, val.url)}  className={`${handles.cardCV} flex flex-column mv7 mh5 ba b--black-10 shadow-1 w-auto`}>
              <h4 className={`${handles.textCV} mt7 ml3`} >{val.nombre}</h4>
              <img src={val.imageUrl} className={`${handles.imageCV} mt7`} />
            </div>
          </div>

        ))}
      </div>

    </div>
  )
}

Categorias.schema = {
  title: 'editor.sideboard.title',
  description: 'editor.sideboard.description',
  type: 'object',
  properties: {
    itemsLarge: {
      title: 'Columnas',
      description: 'Cantidad de columnas',
      type: 'number',
      default: 3,
    },    
    itemsSmall: {
      title: 'Columnas',
      description: 'Cantidad de columnas',
      type: 'number',
      default: 1,
    },
  },
}

export default Categorias
