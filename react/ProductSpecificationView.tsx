import React, {useState, useEffect, ReactNode } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { Specification, productSpecificationResponse } from './typings/productos'
import { Input, Table } from 'vtex.styleguide'

interface TablePagination {
  currentPage: number,
  currentItemFrom: number,
  currentItemTo: number
}


interface ProductSpecificationViewProps {products: productSpecificationResponse[], addProduct(product:productSpecificationResponse): void}

const CSS_HANDLES = ['cardCV', 'imageCV','textCV', 'headerCV', 'descriptionCV', 'breadcrumbCV', 'containerCV', 'buscadorCV', 'mostrarmas']

const ProductSpecificationView: StorefrontFunctionComponent<ProductSpecificationViewProps> = ({products, addProduct}) => {

  const handles = useCssHandles(CSS_HANDLES)
  const tableLength = 5
  const initialProps:TablePagination = {
    currentPage: 1,
    currentItemFrom: 1,
    currentItemTo: tableLength,
  }

  const [currentProps, setNewProps] = useState<TablePagination>(initialProps)
  const [datosPagina, setdatosPagina]:any[] = useState([])
  const [filtros, setFiltros]:any[] = useState([])
  const [total, setTotal] = useState(0)

  const listProducts = products;

  //dataSource
  useEffect(() => {
    const itemsT:any[] = []

    listProducts.forEach(element => {
      const itm:any = {}
      itm['sku'] = element.id;
      element.specifications.forEach((iProduct:Specification) => {
          itm[iProduct.key] = iProduct.value;
      });

      let coincide = true
      if(filtros.length > 0){
        coincide = false
        filtros.forEach((filtro:any) => {
          if(itm[filtro.subject].includes(filtro.object))
            coincide = true;
        });
      }

      if (coincide)
        itemsT.push(itm)
    });

    setTotal(itemsT.length)
    setdatosPagina(itemsT.slice((currentProps.currentItemFrom - 1), currentProps.currentItemTo))

  },[products, currentProps, filtros])


//handlers
const handleNextClick = () => {
  const newPage:TablePagination = {
    currentPage: currentProps.currentPage + 1,
    currentItemFrom: currentProps.currentItemTo + 1,
    currentItemTo: tableLength * (currentProps.currentPage + 1)
  }
  setNewProps(newPage)
}

const handlePrevClick = () => {
  if (currentProps.currentPage === 0) return
  const newPage:TablePagination = {
    currentPage: currentProps.currentPage - 1,
    currentItemFrom: currentProps.currentItemFrom - tableLength,
    currentItemTo: currentProps.currentItemFrom - 1
  }
  setNewProps(newPage)
}

console.log(addProduct)

// Schema and filters
  let defaultSchema:{properties:any} = {
    properties: {
      sku: {
        title: 'SKU',
        width: 300,
      }
    },
  }

  const simpleInputObject = ({ value, onChange }: { value: string | null; onChange: (value: string) => void }): ReactNode => {
    return <Input value={value || ''} onChange={(e:any) => onChange(e.target.value)} />;
  };

  let filterOptions: any = {}
  filterOptions['sku'] = {
    label: 'SKU',
    renderFilterLabel: (st:any) => {
      if (!st || !st.object) {
        return 'Any';
      }
      return `${st.verb === '=' ? 'is' : st.verb === '!=' ? 'is not' : 'contains'} ${st.object}`;
    },
    verbs: [
      {
        label: 'contains',
        value: 'contains',
        object: simpleInputObject,
      },
    ],
  }

  if(products.length > 0){
    products[0].specifications.forEach((elem:Specification) => {
      filterOptions[elem.key] = {
        label: elem.key,
        renderFilterLabel: (st:any) => {
          if (!st || !st.object) {
            return 'Any';
          }
          return `${st.verb === '=' ? 'is' : st.verb === '!=' ? 'is not' : 'contains'} ${st.object}`;
        },
        verbs: [
          {
            label: 'contains',
            value: 'contains',
            object: simpleInputObject,
          },
        ],
      }
      defaultSchema.properties[elem.key] = {title: elem.key, width: 200}
    }); 
  }


  const cambioBusqueda = (val:any) => {
    setFiltros(val)
  };


  console.log(setFiltros)

  return (
    <div>
      <h2>Vista especifiaciones</h2>
      <div className={`${handles.containerCV}`}>
        <Table
          schema={defaultSchema} 
          items={datosPagina} 
          fullWidth 
          density="high"
          pagination={{
            onNextClick: handleNextClick,
            onPrevClick: handlePrevClick,
            currentItemFrom: currentProps.currentItemFrom,
            currentItemTo: currentProps.currentItemTo,
            //onRowsChange: this.handleRowsChange,
            textShowRows: 'Show rows',
            textOf: 'of',
            totalItems: total
          }}
          filters={{
            alwaysVisibleFilters: ['sku'],
            statements: filtros,
            onChangeStatements: cambioBusqueda,
            clearAllFiltersButtonLabel: 'Clear filters',
            collapseLeft: true,
            options: filterOptions
          }}
        />
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
