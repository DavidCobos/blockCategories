async function getCategories(categoryId: number){
    try
    {
        const catRes = await fetch("https://davidprivarsa--privarsa.myvtex.com/privarsa/subcategory/" + categoryId, {
            headers:{
                "Cache-Control": "max-age=3600000, forceMaxAge"
            }
        })
        
        if(catRes.status != 200){
            throw new Error("Error de status")
        }

        return catRes.json()
    }
    catch
    {
        throw new Error("Error de peticion")
    }
}

async function getMainProductInfo(productId: string){
    try
    {
        const catRes = await fetch("https://davidprivarsa--privarsa.myvtex.com/privarsa/mainproductinfo/" + productId, {
            headers:{
                "Cache-Control": "max-age=3600000, forceMaxAge"
            }
        })
        
        if(catRes.status != 200){
            throw new Error("Error de status")
        }

        return catRes.json()
    }
    catch
    {
        throw new Error("Error de peticion")
    }
}

async function getProductSpecification(mainProductId: number){
    try
    {
        const catRes = await fetch("https://davidprivarsa--privarsa.myvtex.com/privarsa/productspecifications/" + mainProductId, {
            headers:{
                "Cache-Control": "max-age=3600000, forceMaxAge"
            }
        })
        
        if(catRes.status != 200){
            throw new Error("Error de status")
        }

        return catRes.json()
    }
    catch
    {
        throw new Error("Error de peticion")
    }
}

const servicioPrivarsa = {
    getCategories,
    getMainProductInfo,
    getProductSpecification
}


export default servicioPrivarsa