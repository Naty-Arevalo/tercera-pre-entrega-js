const shopContent= document.querySelector("#shopContent");
const verCarrito = document.querySelector("#verCarrito");
const modalContainer = document.querySelector("#modal-container")

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];


const pedirProduct = async () => {
    const resp = await fetch(`./data.json`)
    const data = await resp.json()

        data.forEach((post) =>{
            const content = document.createElement("div")
            content.className="card"
            content.innerHTML=`
            <img src="${post.img}">
            <h3>${post.nombre}</h3>
            <p class="price">$${post.precio}</p>
            `

            shopContent.append(content)


            //creamos el boton agregar al carrito dentro del div "content"    
    let comprar = document.createElement("button")
    comprar.className ="comprar"
    comprar.innerText ="Agregar Al Carrito"

    content.append(comprar)

// creamos el evento click en ese button
    comprar.addEventListener("click", () => {
        Toastify({
            text: "Producto Agregado al Carrito",
            duration: 2000,
            close: true,
            gravity: "top", 
            position: "right", 
            stopOnFocus: true, 
            style: {
            background: "linear-gradient(to right, #121212, #126412)",
            },
            onClick: function(){} 
        }).showToast();
//some devuelve true o false, para ver si hay algun product.id en en el carrito
    const repeat = carrito.some((repeatProduct) => repeatProduct.id === post.id)
//si ese id existe, se suma en cantidad, sino pushea el objeto
    if(repeat){
        carrito.map((prod) =>{
            if(prod.id === post.id){
                prod.cantidad++
            }
        })
    }else{
        carrito.push({
            id: post.id,
            nombre: post.nombre,
            img:post.img,
            precio: post.precio,
            cantidad: post.cantidad
        });
        sincronizarStorage()
    }
    });
    
});
        }
    

pedirProduct()

//creo el modal para mostrar los elementos en el carrito
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



//recorro el carrito y creo un div donde colocar cada elemento del objeto
    carrito.forEach((product) =>{
        let carritoContent = document.createElement("div")
        carritoContent.className = "modal-content"
        carritoContent.innerHTML = `
        <img src="${product.img}">
        <h3>${product.nombre}</h3>
        <p>$${product.precio}</p>
        <p> cantidad:${product.cantidad}</p>
        <p>Total:$ ${product.cantidad * product.precio}</p>
        <span class="delete-product"> <i class="bi bi-trash3"></i> </span>
        `

        modalContainer.append(carritoContent)


        let eliminar = carritoContent.querySelector(".delete-product")
        eliminar.addEventListener("click", () => {
            eliminarProducto(product.id)
        })
    })
    

//para lograr el total a pagar se recorre el array del precio * el producto
    let total = carrito.reduce((acc, el) => acc + el.precio * el.cantidad , 0)
//creamos el div donde ira el total a pagar
    const totalAPagar = document.createElement("div")
    totalAPagar.className = "total-content"
    totalAPagar.innerHTML = `Total a Pagar: $${total}`
    modalContainer.append(totalAPagar)
//funcion para ver si el total supera tal numero devuelve otro total
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
//metodo para que no recargue la pagina cada vez que se hace click en el carrito
verCarrito.addEventListener("click", (e) =>{
    e.preventDefault()
    
})

//evento para cada vez que se hace click en el carrito muestre el modal
verCarrito.addEventListener("click", mostrarCarrito)


// funcion para eliminar productos del modal
const eliminarProducto = (id) =>{
    const foundId = carrito.find((element) => element.id === id)
    
    carrito = carrito.filter((carritoId) =>{
        return carritoId !== foundId
    })
    sincronizarStorage()
    mostrarCarrito()
}

//funcion para cargar en el storage el carrito
const sincronizarStorage = () =>{
    localStorage.setItem("carrito", JSON.stringify(carrito))
} 


