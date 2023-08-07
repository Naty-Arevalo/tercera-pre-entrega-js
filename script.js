const shopContent= document.querySelector("#shopContent");
const verCarrito = document.querySelector("#verCarrito");
const modalContainer = document.querySelector("#modal-container")

let carrito = [];

//operador ternario
localStorage.getItem((carrito)) ? carrito= JSON.parse(localStorage.getItem((carrito))) : localStorage.setItem((carrito) , JSON.stringify((carrito)));


productos.forEach((product) => {
    let content = document.createElement("div");
    content.className = "card" 
    content.innerHTML = `
    <img src="${product.img}">
    <h3>${product.nombre}</h3>
    <p class="price">$${product.precio}</p>
    `
    shopContent.append(content)

    let comprar = document.createElement("button")
    comprar.className ="comprar"
    comprar.innerText ="Agregar Al Carrito"

    content.append(comprar)

    comprar.addEventListener("click", () => {

    const repeat = carrito.some((repeatProduct) => repeatProduct.id === product.id)

    if(repeat){
        carrito.map((prod) =>{
            if(prod.id === product.id){
                prod.cantidad++
            }
        })
    }else{
        carrito.push({
            id: product.id,
            nombre: product.nombre,
            img: product.img,
            precio: product.precio,
            cantidad: product.cantidad
        });
        localStorage.setItem("carrito", JSON.stringify(carrito))    
    }
    
    console.log(carrito)  
    });
    
});

const mostrarCarrito = () =>{

    modalContainer.innerHTML = ""
    modalContainer.style.display = "flex"
    const modalHeader = document.createElement("div")
    modalHeader.className = "modal-header"
    modalHeader.innerHTML = `
        <h1 class="modal-header-title">Carrito</h1>
    `
    modalContainer.append(modalHeader);

    const modalbutton = document.createElement("button")
    modalbutton.innerText= "X"
    modalbutton.className = "modal-header-button"

    modalbutton.addEventListener("click", () =>{
        modalContainer.style.display = "none"
    })

    modalHeader.append(modalbutton)

    carrito.forEach((product) =>{
        let carritoContent = document.createElement("div")
        carritoContent.className = "modal-content"
        carritoContent.innerHTML = `
        <img src="${product.img}">
        <h3>${product.nombre}</h3>
        <p>$${product.precio}</p>
        <p> cantidad:${product.cantidad}</p>
        <p>Total:$ ${product.cantidad * product.precio}</p>
        `

        modalContainer.append(carritoContent)

        let eliminar = document.createElement("span")
        eliminar.innerText = ("x")
        eliminar.className = "delete-product"
        carritoContent.append(eliminar)

        eliminar.addEventListener("click", eliminarProducto)
    
        localStorage.setItem("carrito", JSON.stringify(carrito))
    })
    

    
    let total = carrito.reduce((acc, el) => acc + el.precio * el.cantidad , 0)

    const totalAPagar = document.createElement("div")
    totalAPagar.className = "total-content"
    totalAPagar.innerHTML = `Total a Pagar: $${total}`
    modalContainer.append(totalAPagar)

    function descuentos(){
        let descuento = total
        let descuento10 = descuento - (total * 0.10)
        if (total >= 15000){
            let descuentoVisual = document.createElement("p")
            descuentoVisual.className = ("desc-visual")
            descuentoVisual.innerHTML = (`Tu compra supera los $15000! tenes un descuento del 10%, tu pago será de : $${descuento10}`)
            modalContainer.append(descuentoVisual)
        }else{
            let pie = document.createElement("p")
            pie.className = "pie"
            pie.innerHTML = `Gracias Por tu Compra!`
            modalContainer.append(pie)
        }
    }
    descuentos()
    
}

verCarrito.addEventListener("click", (e) =>{
    e.preventDefault()
})
verCarrito.addEventListener("click", mostrarCarrito)

const eliminarProducto = () =>{
    const foundId = carrito.find((element) => element.id)
    
    carrito = carrito.filter((carritoId) =>{
        return carritoId !== foundId
    })

    mostrarCarrito()
}
