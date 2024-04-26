import React from 'react'
import { useCssHandles } from 'vtex.css-handles'

interface ProductoProps {}

const CSS_HANDLES = ['cardPV', 'gridPV']

const Productos: StorefrontFunctionComponent<ProductoProps> = () => {

    const handles = useCssHandles(CSS_HANDLES)

    return (
        
        <div className='mt7'>
            <div className={`${handles.cardPV} flex flex-wrap`}>
            
            </div>

            <div className={`${handles.gridPV}`}>
            
            </div>
        </div>
    )
}

Productos.schema = {
  title: 'editor.sideboard.title',
  description: 'editor.sideboard.description',
  type: 'object',
  properties: {
    itemsPage: {
      title: 'Productos',
      description: 'Cantidad de productos por pagina',
      type: 'number',
      default: 10,
    },
  },
}

export default Productos
