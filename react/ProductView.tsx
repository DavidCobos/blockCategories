import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { productResponse } from './typings/productos'

interface ProductViewProps {products: productResponse[], large: string, selectProduct(product:productResponse): void}

const CSS_HANDLES = ['cardCV', 'imageCV','textCV', 'headerCV', 'descriptionCV', 'breadcrumbCV', 'containerCV', 'buscadorCV', 'mostrarmas']

const ProductView: StorefrontFunctionComponent<ProductViewProps> = ({products, large, selectProduct}) => {

  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div>
      <div className={`${handles.containerCV} flex flex-wrap`}>
        {products.map((val:productResponse) => (
          <div key={val.id} className={`w-${large}-ns`}>
            <div onClick={() => selectProduct(val)}  className={`${handles.cardCV} flex flex-column mv7 mh5 ba b--black-10 shadow-1 w-auto`}>
              <h4 className={`${handles.textCV} mt7 ml3`} >{val.name}</h4>
              <img src={val.imageUrl} className={`${handles.imageCV} mt7`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

ProductView.schema = {
  title: 'editor.sideboard.title',
  description: 'editor.sideboard.description',
  type: 'object',
  properties: {},
}

export default ProductView
