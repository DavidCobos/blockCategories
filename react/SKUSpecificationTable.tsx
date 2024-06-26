



import React, {useState, useEffect } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { useProduct, useProductDispatch } from 'vtex.product-context'
import servicioPrivarsa from './privarsaVtex.service'
import { MainProductInfoResponse, Specification, ProductSpecificationResponse, ProductsSpecification } from './typings/categoriesNavegatorInterfaces'
import { Input, Table, NumericStepper, Button } from 'vtex.styleguide'
import { IconCart } from 'vtex.store-icons'
import './SKUSpecificationTable.css'
import { useOrderItems } from 'vtex.order-items/OrderItems'

interface SKUSpecificationTableProps {
  registros: number
}

interface TablePagination {
  currentPage: number,
  currentItemFrom: number,
  currentItemTo: number
}

const CSS_HANDLES = ['SKUSpecificationTable_Container', 'SKUSpecificationTable_CustomCell', 'SKUSpecificationTable_CustomHeader']

const SKUSpecificationTable: StorefrontFunctionComponent<SKUSpecificationTableProps> = ({registros}) => {

  const {addItems} = useOrderItems()

  const handles = useCssHandles(CSS_HANDLES)
  const tableLength = registros
  const productContextValue = useProduct();
  const dispatch = useProductDispatch();
  const initialProps:TablePagination = {
    currentPage: 1,
    currentItemFrom: 1,
    currentItemTo: tableLength,
  }

  const [currentProps, setNewProps] = useState<TablePagination>(initialProps)
  const [filtros, setFiltros] = useState<any>([])
  const [datosPagina, setdatosPagina] = useState<any>([])
  const [total, setTotal] = useState(0)
  const [defaultSchema, setdefaultSchema] = useState({properties:{}})
  const [defaultFilters, setdefaultFilters] = useState({})

  let datos:any[] = []
  //dataSource
  useEffect(() => {
    const itemsT:any[] = []
    // const productId = productContextValue?.product?.productReference ?? ""
    // console.log(productId)

    servicioPrivarsa.getProductSpecification(1).then((data:ProductSpecificationResponse) => {
      productContextValue?.product?.items.forEach((skuItem:any) => {

        let itm:any = {}
        let privarsaId = ""

        if(skuItem.referenceId && skuItem.referenceId.length > 0){
          privarsaId = skuItem.referenceId[0].Value
        }else{
          privarsaId = skuItem.name
        }

        const findItem = data.productsSpecifications.find((itm:ProductsSpecification) =>{ return itm.id == privarsaId ? itm : null })

        if(findItem){
          itm['sku'] = findItem.id;

          findItem.specifications.forEach((iProduct:Specification) => {
            itm[iProduct.key] = iProduct.value;
          });
        }else {
          itm['sku'] = privarsaId;
        }

        itm['descripcion'] = skuItem.name;
        itm['cont_compra'] = {valor: 1, id: itm['sku']};
        itm['itm'] = skuItem;
        itm['cotizar'] = 3;

        if(skuItem.sellers.length > 0){
          itm['precio'] = skuItem.sellers[0].commertialOffer.Price;
        }

        let coincide = true
        if(filtros.length > 0){
          coincide = false
          filtros.forEach((filtro:any) => {
            if(itm[filtro.subject].includes(filtro.object))
              coincide = true;
          });
        }

        if (coincide && itm){
          itemsT.push(itm)
        }

        setTotal(itemsT.length)
        datos = itemsT.slice((currentProps.currentItemFrom - 1), currentProps.currentItemTo)
        setdatosPagina(datos)

      })
    }).catch((ex) => console.log(ex))

  },[productContextValue, currentProps, filtros])


  // Schema and filters
  const simpleInputObject = ({ value, onChange }: { value: string | null; onChange: (value: string) => void }) => {
    return <Input value={value || ''} onChange={(e:any) => onChange(e.target.value)} />;
  };

  let addRemoveCounter = (valor: number, cellData:{valor: number, id: string}) => {
    cellData.valor = valor;
  }

  let cotizarSKU = (e:any, cellData:any) => {
    console.log(e)
    console.log(cellData)
  }

  let agregarCarrito = (e:any, cellData:any) => {
    console.log(e)
    console.log(cellData)
    
    addItems([
      {
        id: cellData.id,
        quantity: cellData.valor,
        seller: "1"
      }
    ])

    console.log(addItems)

  }

  useEffect(() => {

    const filterOptions: any = {}
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
    filterOptions['descripcion'] = {
      label: 'Descripción',
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

    const schemaResult:{properties:any} = {
      properties: {
        sku: {
          title: 'SKU',
          width: 100,
          headerRenderer: (elem: any ) => {
            return <label className={`${handles.SKUSpecificationTable_CustomHeader}`}>{elem.title}</label>
          },
        },
        descripcion: {
          title: 'Descripción',
          headerRenderer: (elem: any ) => {
            return <label className={`${handles.SKUSpecificationTable_CustomHeader}`}>{elem.title}</label>
          },
        }
      },
    }
    
    servicioPrivarsa.getMainProductInfo("1").then((data:MainProductInfoResponse) => {
      data.mainProductInfo.specifications.forEach((especifiacion:Specification) => {
        filterOptions[especifiacion.header] = {
          label: especifiacion.header,
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
        };
        schemaResult.properties[especifiacion.header] = { 
          title: especifiacion.name, 
          width: 100,
          headerRenderer: (elem: any ) => {
            return <label className={`${handles.SKUSpecificationTable_CustomHeader}`}>{elem.title}</label>
          },
        };
      }); 
    
      schemaResult.properties["precio"] = {
        title: 'Precio',
        width: 100,
        headerRenderer: (elem: any ) => {
          return <label className={`${handles.SKUSpecificationTable_CustomHeader}`}>{elem.title}</label>
        },
      },

      schemaResult.properties["cont_compra"] = { 
        title: "Comprar", 
        width: 300,
        cellRenderer: ({ cellData }: any) => {
          return (
            <div className={`${handles.SKUSpecificationTable_CustomCell} flex flex-wrap`}>
              <NumericStepper
              size="small"
              value= {cellData.valor}
              minValue= '1'
              onChange={(event: any) => addRemoveCounter(event.value, cellData )}
              />
              <Button variation="primary" size="small" onClick ={(e:any)=> agregarCarrito(e, cellData)}><IconCart/></Button>
            </div>
          )
        }, 
        headerRenderer: (elem: any ) => {
          return <label className={`${handles.SKUSpecificationTable_CustomHeader} w-100 tc`}>{elem.title}</label>
        },
      },

      schemaResult.properties["cotizar"] = {
        title: 'Cotizar',
        width: 200,
        cellRenderer: ({ cellData }: any) => {
          return (
            <div className={`${handles.SKUSpecificationTable_CustomCell} flex flex-wrap`}>
              <Button variation="primary" size="small" onClick ={(e:any)=> cotizarSKU(e, cellData)}>Cotizar</Button>
            </div>
          )
        }, 
        headerRenderer: (elem: any ) => {
          return <label className={`${handles.SKUSpecificationTable_CustomHeader} w-100 tc`}>{elem.title}</label>
        },
      }

    });

    setdefaultSchema(schemaResult)
    setdefaultFilters(filterOptions)

  },[])


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


  const handleRowsClick = (rowData:any) => {
    console.log(rowData)
    console.log(rowData.itm)

    if(dispatch){
      dispatch({
        type: "SET_SELECTED_ITEM",
        args: { item: rowData.itm}
      })
    }
  }

  const cambioBusqueda = (val:any) => {
    setFiltros(val)
  };


  return (
    <div>
      <h2>Vista especifiaciones</h2>
      <div className={`${handles.SKUSpecificationTable_Container}`}>
        <Table
          schema={defaultSchema} 
          items={datosPagina} 
          fullWidth 
          density="high"
          highlightOnHover
          onRowClick= {({rowData}:any) => 
            handleRowsClick(rowData)
          }
          pagination={{
            onNextClick: handleNextClick,
            onPrevClick: handlePrevClick,
            currentItemFrom: currentProps.currentItemFrom,
            currentItemTo: currentProps.currentItemTo,
            textShowRows: 'Show rows',
            textOf: 'of',
            totalItems: total
          }}
          filters={{
            alwaysVisibleFilters: ['sku', 'descripcion'],
            statements: filtros,
            onChangeStatements: cambioBusqueda,
            clearAllFiltersButtonLabel: 'Clear filters',
            collapseLeft: true,
            options: defaultFilters
          }}
        />
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
