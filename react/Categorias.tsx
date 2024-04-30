import React, {useState, useEffect} from 'react'
import servicioPrivarsa from './privarsaVtex.service'
import { useCssHandles } from 'vtex.css-handles'
import { categoryResponse } from './typings/categories'
import { IconHome } from 'vtex.store-icons'
import './Categorias.css'
import FamilyView from './FamilyView'
import ProductView from './ProductView'
import { productResponse, productSpecificationResponse } from './typings/productos'
import ProductSpecificationView from './ProductSpecificationView'

interface CategoriaProps {
  itemsLarge: number
  mostrarMas: number
}

const CSS_HANDLES = ['cardCV', 'imageCV','textCV', 'headerCV', 'descriptionCV', 'breadcrumbCV', 'containerCV', 'buscadorCV', 'mostrarmas']

const Categorias: StorefrontFunctionComponent<CategoriaProps> = ({itemsLarge, mostrarMas}) => {

  const initCat:categoryResponse = {id: 0, nombre: '', title: '', imageUrl: '', special: false,  url:''}

  const [categories, setCategories]: any[] = useState([])
  const [products, setProducts]: any[] = useState([])
  const [productsSpecifications, setProductsSpecidfications]: any[] = useState([])
  const [selectedCategory, setSelectedCategory] = useState<categoryResponse>(initCat)
  const [selectedSubfamily, setSelectedSubfamily] = useState<categoryResponse>(initCat)
  const [selectedProduct, setSelectedProduct] = useState<productResponse>({id: 0, name: '', description: '', imageUrl: ''})
  const [search, setSearch] = useState('')
  const [cargas, setCargas] = useState(1)
  const [mostrarBoton, setMostrar] = useState(false)

  const handles = useCssHandles(CSS_HANDLES)
  
  //Familias y busqueda
  const mostrarTodo = mostrarMas == 0 
  let maxItems = itemsLarge * mostrarMas * cargas

  useEffect(() => {
    if(selectedCategory.id == 0 || selectedSubfamily.id == 0){
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
      }).catch((ex) => console.log(ex))
    }

  },[selectedCategory, search, cargas])

  //Productos y busqueda
  useEffect(() => {
    if(selectedSubfamily.id > 0){
      setMostrar(false)
      servicioPrivarsa.getMainProducts(selectedSubfamily.id).then((data:any) => {
        let filtroP:any[] = []
        data.mainProducts.map((i:any) => {
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

  //Especificacion de productos
  useEffect(() => {
    if(selectedProduct.id > 0){
      servicioPrivarsa.getProductSpecification(selectedProduct.id).then((data:any) => {
        setProductsSpecidfications(data.productsSpecifications)
      }).catch((ex) => console.log(ex))
    }

  },[selectedProduct])

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
    setCargas(1)
  }

  const home = () => {
    setSelectedCategory(initCat) 
    setSelectedSubfamily(initCat)
    setSelectedProduct({id: 0, name: '', description: '', imageUrl: ''})
  }

  const family = () => { 
    setSelectedSubfamily(initCat)
    setSelectedProduct({id: 0, name: '', description: '', imageUrl: ''})
  }

  const subfamily = () => { 
    setSelectedProduct({id: 0, name: '', description: '', imageUrl: ''})
  }

  const agregarCarrito = (product: productSpecificationResponse) => {
    console.log(product) 
  }

  const buscar = (palabra:string) => {
    setSearch(palabra)
  }

  const mostrarMasClick = () => {
    setCargas(cargas + 1)
  }


  //Encabezados
  let breadcrumb, header, description;

  if (selectedProduct.id > 0) {
    breadcrumb = <span className='flex ml7'><span className={`${handles.breadcrumbCV} flex`} onClick={() => home()}><IconHome /> <p className='pl2 ma0 pt1'>Familias</p></span>  <span className={`${handles.breadcrumbCV} flex`} onClick={() => family()}> <p className='pl2 ma0 pt1'>&gt; {selectedCategory.nombre}</p> </span> <span className={`${handles.breadcrumbCV} flex`} onClick={() => subfamily()}> <p className='pl2 ma0 pt1'>&gt; {selectedSubfamily.nombre}</p> </span> <span className={`${handles.breadcrumbCV} flex`}> <p className='pl2 ma0 pt1'>&gt; {selectedProduct.name}</p> </span> </span> ;
    header = <h2 className={`${handles.headerCV} mt3 tc`}>{selectedProduct.name}</h2>;
    description =  <h3 className={`${handles.descriptionCV} mt3 tc`}> Descripción de producto padre</h3>;
  } else if (selectedSubfamily.id > 0) {
    breadcrumb = <span className='flex ml7'><span className={`${handles.breadcrumbCV} flex`} onClick={() => home()}><IconHome /> <p className='pl2 ma0 pt1'>Familias</p></span>  <span className={`${handles.breadcrumbCV} flex`} onClick={() => family()}> <p className='pl2 ma0 pt1'>&gt; {selectedCategory.nombre}</p> </span> <span className={`${handles.breadcrumbCV} flex`}> <p className='pl2 ma0 pt1'>&gt; {selectedSubfamily.nombre}</p> </span> </span> ;
    header = <h2 className={`${handles.headerCV} mt3 tc`}>{selectedSubfamily.nombre}</h2>;
    description =  <h3 className={`${handles.descriptionCV} mt3 tc`}> Descripción de subfamilia</h3>;
  } else if (selectedCategory.id > 0) {
    breadcrumb = <span className='flex ml7'><span className={`${handles.breadcrumbCV} flex`} onClick={() => home()}><IconHome /> <p className='pl2 ma0 pt1'>Familias</p></span>  <span className={`${handles.breadcrumbCV} flex`}> <p className='pl2 ma0 pt1'>&gt; {selectedCategory.nombre}</p> </span> </span> ;
    header = <h2 className={`${handles.headerCV} mt3 tc`}>{selectedCategory.nombre}</h2>;
    description =  <h3 className={`${handles.descriptionCV} mt3 tc`}> Descripción de familia</h3>;
  } else {
    breadcrumb = <span className='flex ml7'> <span className={`${handles.breadcrumbCV} flex`} onClick={() => home()}><IconHome/> <p className='pl2 ma0 pt1'>Familias</p></span> </span> ;
    header =  <h2 className={`${handles.headerCV} mt3 tc`}> Privarsa</h2>;
    description = <p className={`${handles.descriptionCV} mt3 tc`}>Descripción de general</p>;
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
          <input placeholder='&#xF002; Buscar' type='text' className={`${handles.buscadorCV} ba br3 pa2`} value={search} onChange={(e: any) => buscar(e.target.value)} ></input>
        </div>
      </div>

      <div>
        {header}
        <hr></hr>
        {description}
      </div>

      {selectedProduct.id > 0
      ?
      <ProductSpecificationView products={productsSpecifications} addProduct={agregarCarrito}/>
      :
      <></>
      }
      {(selectedSubfamily.id > 0 && selectedProduct.id == 0) 
      ?
      <ProductView products={products} large={numeroLarge} selectProduct={selectProduct}/>
      :
      <></>
      }
      {selectedSubfamily.id == 0
      ?
      <FamilyView categories={categories} large={numeroLarge} selectCategory={selectCategory}/>
      :
      <></>
      }

      {mostrarBoton 
      ? 
      <div className={`flex justify-center ma7`}>
        <a className={`${handles.mostrarmas} bw1 fw5 ba v-mid ph4 lh-solid br2 inline-flex items-center no-underline bg-action-primary b--action-primary c-on-action-primary hover-bg-action-primary hover-b--action-primary hover-c-on-action-primary min-h-regular t-action`} onClick={() => mostrarMasClick()}>
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
