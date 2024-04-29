export interface productResponse {
    id: number
    name: string
    description: string
    imageUrl: string
}

export interface Specification {
    key: string
    value: string
}

export interface productSpecificationResponse {
    id: string
    specifications: Specification[]
}