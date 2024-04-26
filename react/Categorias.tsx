import React, {useState, useEffect} from 'react'
import servicioPrivarsa from './privarsaVtex.service'
import { useCssHandles } from 'vtex.css-handles'
import { categoryResponse } from './typings/categories'
import { IconHome } from 'vtex.store-icons'
import './Categorias.css'
import FamilyView from './FamilyView'
import ProductView from './ProductView'
import { productResponse } from './typings/productos'

interface CategoriaProps {
  itemsLarge: number
  mostrarMas: number
}

const CSS_HANDLES = ['cardCV', 'imageCV','textCV', 'headerCV', 'descriptionCV', 'breadcrumbCV', 'containerCV', 'buscadorCV', 'mostrarmas']

const Categorias: StorefrontFunctionComponent<CategoriaProps> = ({itemsLarge, mostrarMas}) => {

  const [categories, setCategories]: any[] = useState([])
  const [products, setProducts]: any[] = useState([])
  const [selectedCategory, setSelectedCategory] = useState<categoryResponse>({id: 0, nombre: '', title: '', imageUrl: '', special: false,  url:''})
  const [selectedSubfamily, setSelectedSubfamily] = useState<categoryResponse>({id: 0, nombre: '', title: '', imageUrl: '', special: false,  url:''})
  const [selectedProduct, setSelectedProduct] = useState<productResponse>({id: 0, name: '', description: '', imageUrl: ''})
  const [search, setSearch] = useState('')
  const [cargas, setCargas] = useState(1)
  const [mostrarBoton, setMostrar] = useState(false)

  const handles = useCssHandles(CSS_HANDLES)
  
  //Familias y busqueda
  const mostrarTodo = mostrarMas == 0 
  let maxItems = itemsLarge * mostrarMas * cargas

  useEffect(() => {
    setMostrar(false)
    servicioPrivarsa.getCategories(selectedCategory.id).then((data:any) => {
      
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

  //Productos y busqueda
  useEffect(() => {
    if(selectedSubfamily.id > 0){
      setMostrar(false)
      servicioPrivarsa.getMainProducts(selectedSubfamily.id).then((data:any) => {
        
        let filtroP:any[] = []
        console.log(data)
        data.mainProducts.map((i:any) => {
          console.log(i)
          if (i.name.toUpperCase().includes(search.toUpperCase())){
            if (mostrarTodo || maxItems != 0) {
              filtroP.push(i)
              maxItems = maxItems - 1
            }else if(!mostrarTodo){
              setMostrar(true)
            }
          }
        })

        setProducts(filtroP)
      }).catch((ex) => console.log(ex))
    }
  },[selectedSubfamily, search, cargas])

  //Breadcrumb
  const selectCategory = (category: categoryResponse) => {
    if (selectedCategory.id == 0) {
      setSelectedCategory(category)
      setCargas(1)
    }else{
      setSelectedSubfamily(category)
      setCargas(1)
    }
  }

  const selectProduct = (product: productResponse) => {
    setSelectedProduct(product)
    console.log(selectedProduct)
  }

  //Encabezados
  let breadcrumb, header, description;

  if (selectedCategory.id > 0) {
    breadcrumb = <span className='flex ml7'><span className={`${handles.breadcrumbCV} flex`} onClick={() => setSelectedCategory({id: 0, nombre: '', title: '', imageUrl: '', special: false,  url:''})}><IconHome /> <p className='pl2 ma0 pt1'>Familias</p></span>  <span className={`${handles.breadcrumbCV} flex`}> <p className='pl2 ma0 pt1'>&gt; {selectedCategory.nombre}</p> </span> </span> ;
    header = <h2 className={`${handles.headerCV} mt3 tc`}>{selectedCategory.nombre}</h2>;
    description =  <h3 className={`${handles.descriptionCV} mt3 tc`}> Descripción de subfamilia</h3>;
  } else {
    breadcrumb = <span className='flex ml7'> <span className={`${handles.breadcrumbCV} flex`} onClick={() => setSelectedCategory({id: 0, nombre: '', title: '', imageUrl: '', special: false,  url:''})}><IconHome/> <p className='pl2 ma0 pt1'>Familias</p></span> </span> ;
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

  //Cambio a vista de producto
  let main;

  if(selectedSubfamily.id > 0){
    console.log(products)
    main = ProductView({products: products, large: numeroLarge, selectProduct: selectProduct})
  }else{
    main = FamilyView({categories: categories, large: numeroLarge, selectCategory: selectCategory})
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

      {main}

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
