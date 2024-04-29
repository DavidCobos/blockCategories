import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { Specification, productSpecificationResponse } from './typings/productos'

  interface Column {
    id?: string
    title?: any
    width?: number | string
    sortable?: boolean
    cellRenderer?: any
    extended?: boolean
    condensed?: string[]
  }

interface ProductSpecificationViewProps {products: productSpecificationResponse[], addProduct(product:productSpecificationResponse): void}

const CSS_HANDLES = ['cardCV', 'imageCV','textCV', 'headerCV', 'descriptionCV', 'breadcrumbCV', 'containerCV', 'buscadorCV', 'mostrarmas']

const ProductSpecificationView: StorefrontFunctionComponent<ProductSpecificationViewProps> = ({products, addProduct}) => {

  const handles = useCssHandles(CSS_HANDLES)

  
  console.log(products)
  console.log(addProduct)

  let columnsT:Column[] = [
    {
        id: 'id',
        title: 'id',
        width: '3rem'
    }
  ]


  if(products.length > 0){
    products[0].specifications.forEach((elem:Specification) => {
        columnsT.push({
            id: elem.key,
            title: elem.key
        })
    }); 
  }

//   columns.push({
//         id: 'actions',
//         width: '3rem',
//         //cellRenderer: props => <Actions {...props} />,
//         extended: true,
//   })

  let itemsT:any[] = []
  
  products.forEach(element => {
    const itm:any = {}
    itm['id'] = element.id;
    element.specifications.forEach((iProduct:Specification) => {
        itm[iProduct.key] = iProduct.value;
    })
    itemsT.push(itm)
}) 

  console.log(columnsT)
  console.log(itemsT)


  return (
    <div>
      <div className={`${handles.containerCV} flex flex-wrap`}>
        <h2>Nueva vista</h2>
      </div>
    </div>
  )
}

ProductSpecificationView.schema = {
  title: 'editor.sideboard.title',
  description: 'editor.sideboard.description',
  type: 'object',
  properties: {},
}

export default ProductSpecificationView
