import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { categoryResponse } from './typings/categories'

interface FamilyViewProps {categories: categoryResponse[], large: string, selectCategory(category:categoryResponse): void}

const CSS_HANDLES = ['cardCV', 'imageCV','textCV', 'headerCV', 'descriptionCV', 'breadcrumbCV', 'containerCV', 'buscadorCV', 'mostrarmas']

const FamilyView: StorefrontFunctionComponent<FamilyViewProps> = ({categories, large, selectCategory}) => {

  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div>
      <div className={`${handles.containerCV} flex flex-wrap`}>
        {categories.map((val:categoryResponse) => (
          <div key={val.id} className={`w-${large}-ns`}>
            <div onClick={() => selectCategory(val)}  className={`${handles.cardCV} flex flex-column mv7 mh5 ba b--black-10 shadow-1 w-auto`}>
              <h4 className={`${handles.textCV} mt7 ml3`} >{val.nombre}</h4>
              <img src={val.imageUrl} className={`${handles.imageCV} mt7`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

FamilyView.schema = {
  title: 'editor.sideboard.title',
  description: 'editor.sideboard.description',
  type: 'object',
  properties: {},
}

export default FamilyView
