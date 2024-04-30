import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { useProduct } from 'vtex.product-context'


interface SKUSpecificationTableProps {}

const CSS_HANDLES = ['SKUSpecificationTable_']

const SKUSpecificationTable: StorefrontFunctionComponent<SKUSpecificationTableProps> = () => {

  const handles = useCssHandles(CSS_HANDLES)

  const productContextValue = useProduct();
  console.log(productContextValue);

  return (
    <div>
      <h2>Vista especifiaciones</h2>
      <div className={`${handles.SKUSpecificationTable_}`}>
      </div>
    </div>
  )
}

SKUSpecificationTable.schema = {
  title: 'editor.skutable.title',
  description: 'editor.skutable.description',
  type: 'object',
  properties: {},
}

export default SKUSpecificationTable
