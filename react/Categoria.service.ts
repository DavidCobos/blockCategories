async function getCategories(){
    try
    {
        const catRes = await fetch("https://davidprivarsa--privarsa.myvtex.com/privarsa/category", {
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

export default getCategories