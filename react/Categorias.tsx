import React, {useState, useEffect} from 'react'
import getCategories from './Categoria.service'
import { useCssHandles } from 'vtex.css-handles'
import { categoryResponse } from './typings/categories'
import { IconHome } from 'vtex.store-icons'
import './Categorias.css'

interface CategoriaProps {
  itemsLarge: number
  mostrarMas: number
}

const CSS_HANDLES = ['cardCV', 'imageCV','textCV', 'headerCV', 'descriptionCV', 'breadcrumbCV', 'containerCV', 'buscadorCV', 'mostrarmas']

const Categorias: StorefrontFunctionComponent<CategoriaProps> = ({itemsLarge, mostrarMas}) => {

  const [categories, setCategories]: any[] = useState([])
  const [selectedCategory, setSelected] = useState(0)
  const [selectedCategoryName, setSelectedName] = useState('')
  const [search, setSearch] = useState('')
  const [cargas, setCargas] = useState(1)
  const [mostrarBoton, setMostrar] = useState(false)

  //Breadcrumb
  const selectCategory = (id:number, nombre:string, url:string) => {
    if (selectedCategory > 0) {
      window.location.href = url.replace('https://privarsa.vtexcommercestable.com.br', 'https://privarsa.myvtex.com');
    }else{
      setSelected(id)
      setSelectedName(nombre)
      setCargas(1)
    }
  }

  const handles = useCssHandles(CSS_HANDLES)
  
  //Familias y busqueda
  const mostrarTodo = mostrarMas == 0 
  let maxItems = itemsLarge * mostrarMas * cargas

  useEffect(() => {
    setMostrar(false)
    getCategories(selectedCategory).then((data:any) => {
      
      let filtro:any[] = []
      data.categorias.map((i:any) => {
        if (i.nombre.toUpperCase().includes(search.toUpperCase())){
          if (mostrarTodo || maxItems != 0) {
            filtro.push(i)
            maxItems = maxItems - 1
          }else if(!mostrarTodo){
            setMostrar(true)
          }
        }
      })

      setCategories(filtro)
    }).catch(() => console.log("Error getCategories"))
  },[selectedCategory, search, cargas])


  console.log(mostrarBoton)

  //Encabezados
  let breadcrumb, header, description;

  if (selectedCategory > 0) {
    breadcrumb = <span className='flex ml7'><span className={`${handles.breadcrumbCV} flex`} onClick={() => setSelected(0)}><IconHome /> <p className='pl2 ma0 pt1'>Familias</p></span>  <span className={`${handles.breadcrumbCV} flex`}> <p className='pl2 ma0 pt1'>&gt; {selectedCategoryName}</p> </span> </span> ;
    header = <h2 className={`${handles.headerCV} mt3 tc`}>{selectedCategoryName}</h2>;
    description =  <h3 className={`${handles.descriptionCV} mt3 tc`}> Descripción de familia</h3>;
  } else {
    breadcrumb = <span className='flex ml7'> <span className={`${handles.breadcrumbCV} flex`} onClick={() => setSelected(0)}><IconHome/> <p className='pl2 ma0 pt1'>Familias</p></span> </span> ;
    header =  <h2 className={`${handles.headerCV} mt3 tc`}> Privarsa</h2>;
    description = <p className={`${handles.descriptionCV} mt3 tc`}>Descripción de familia</p>;
  }

  //Items por fila
  const decena = 100 / itemsLarge
  let numeroLarge = ""

  if (itemsLarge == 3){
    numeroLarge = 'third'
  }else{
    numeroLarge = decena.toString()
  }

  return (
    
    <div className='mt7'>

      <div className='flex'>
        <div className='mr-auto'>
          {breadcrumb}
        </div>
        <div className='ml-auto'>
          <input placeholder='&#xF002; Buscar' type='text' className={`${handles.buscadorCV} ba br3 pa2`} value={search} onChange={(e: any) => setSearch(e.target.value)} ></input>
        </div>
      </div>

      <div>
        {header}
        <hr></hr>
        {description}
      </div>

      <div className={`${handles.containerCV} flex flex-wrap`}>
        {categories.map((val:categoryResponse) => (
          <div key={val.id} className={`w-${numeroLarge}-ns`}>
            <div onClick={() => selectCategory(val.id, val.nombre, val.url)}  className={`${handles.cardCV} flex flex-column mv7 mh5 ba b--black-10 shadow-1 w-auto`}>
              <h4 className={`${handles.textCV} mt7 ml3`} >{val.nombre}</h4>
              <img src={val.imageUrl} className={`${handles.imageCV} mt7`} />
            </div>
          </div>
        ))}
      </div>

      {mostrarBoton 
      ? 
      <div className={`flex justify-center ma7`}>
        <a className={`${handles.mostrarmas} bw1 fw5 ba v-mid ph4 lh-solid br2 inline-flex items-center no-underline bg-action-primary b--action-primary c-on-action-primary hover-bg-action-primary hover-b--action-primary hover-c-on-action-primary min-h-regular t-action`} onClick={() => setCargas(cargas + 1)}>
          <span className=''>
            Mostrar mas
          </span>
        </a>
      </div>
      :
      <></>
      }
      


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
    mostrarMas: {
      title: 'Filas',
      description: 'Cantidad de filas',
      type: 'number',
      default: 0,
    },
  },
}

export default Categorias
