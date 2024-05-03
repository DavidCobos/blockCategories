export interface MainProductInfoResponse {
    mainProductInfo: MainProductInfo
  }
  
  export interface MainProductInfo {
    details: Details
    specifications: Specification[]
  }
  
  export interface Details {
    id: string
    name: string
    description: string
  }
  
  export interface Specification {
    id: string
    header: string
    name: string
    note: string
  }

  export interface ProductSpecificationResponse {
    productsSpecifications: ProductsSpecification[]
  }
  
  export interface ProductsSpecification {
    id: string
    specifications: Specification[]
  }
  
  export interface Specification {
    key: string
    value: string
  }
  