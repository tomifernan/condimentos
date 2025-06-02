const carrito = []

function formatearPrecio(valor) {
  return valor % 1 === 0 ? valor.toFixed(0) : valor.toFixed(2)
}
function actualizarCarrito() {
  const lista = document.getElementById("listaCarrito")
  const total = document.getElementById("total")
  const botonFlotante = document.getElementById("botonCarritoFlotante")

  lista.innerHTML = ""
  let suma = 0

  carrito.forEach((producto, index) => {
    const li = document.createElement("li")
    // Mostrar cantidad si es mayor a 1
    const cantidadTexto = producto.cantidad > 1 ? `X${producto.cantidad} ` : ""
    li.textContent = `${cantidadTexto}${producto.nombre} - $${(producto.precio * producto.cantidad).toFixed(2)}`

    const eliminarIcono = document.createElement("i")
    eliminarIcono.classList.add("fa", "fa-trash-alt", "eliminar")
    eliminarIcono.onclick = () => eliminarDelCarrito(index)

    li.appendChild(eliminarIcono)
    lista.appendChild(li)

    suma += producto.precio * producto.cantidad
  })

total.textContent = `${(suma % 1 === 0 ? suma.toFixed(0) : suma.toFixed(2))}`  
  if (botonFlotante) {
    botonFlotante.textContent = `🛒 Ver carrito ($${suma.toFixed(2)})`
  }
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1)
  actualizarCarrito()
}

function enviarPorWhatsApp() {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío.")
    return
  }

  let mensaje = "Hola! Quisiera pedir:\n"
  carrito.forEach((producto) => {
    const cantidadTexto = producto.cantidad > 1 ? `X${producto.cantidad} ` : ""
    mensaje += `- ${cantidadTexto}${producto.nombre} $${(producto.precio * producto.cantidad).toFixed(2)}\n`
  })

  const total = carrito.reduce((sum, p) => sum + (p.precio * p.cantidad), 0)
  mensaje += `Total: $${total.toFixed(2)}`

  const url = `https://wa.me/3364401947?text=${encodeURIComponent(mensaje)}`
  window.open(url, "_blank")
}

function enviarDatosYPedido() {
  const nombre = document.getElementById("nombre").value.trim()
  const apellido = document.getElementById("apellido").value.trim()
  const provincia = document.getElementById("provincia").value.trim()
  const ciudad = document.getElementById("ciudad").value.trim()
  const direccion = document.getElementById("direccion").value.trim()
  const comprobante = document.getElementById("comprobante").files[0]

  if (!nombre || !apellido || !provincia || !ciudad || !direccion || !comprobante) {
    alert("Por favor completá todos los campos y subí el comprobante de pago.")
    return
  }

  if (carrito.length === 0) {
    alert("Tu carrito está vacío.")
    return
  }

  let mensaje = `Nuevo pedido de numb.splashvt\n`
  mensaje += `Cliente: ${nombre} ${apellido}\n`
  mensaje += `Dirección: ${direccion}, ${ciudad}, ${provincia}\n`
  mensaje += `Productos:\n`

  carrito.forEach(producto => {
    const cantidadTexto = producto.cantidad > 1 ? `X${producto.cantidad} ` : ""
    mensaje += `- ${cantidadTexto}${producto.nombre} - $${(producto.precio * producto.cantidad).toFixed(2)}\n`
  })

  const total = carrito.reduce((sum, p) => sum + (p.precio * p.cantidad), 0)
  mensaje += `Total: $${total.toFixed(2)}\n`
  mensaje += `Comprobante: el cliente lo enviará como imagen.`

  alert("Se abrirá WhatsApp. Por favor, adjuntá el comprobante de pago como imagen en el chat.")

  const url = `https://wa.me/3537594913?text=${encodeURIComponent(mensaje)}`
  window.open(url, "_blank")
}

function toggleMenu() {
  const nav = document.querySelector(".navbar nav")
  let overlay = document.querySelector(".menu-overlay")
  const body = document.body

  if (!overlay) {
    overlay = document.createElement("div")
    overlay.className = "menu-overlay"
    overlay.onclick = toggleMenu
    document.body.appendChild(overlay)
  }

  nav.classList.toggle("active")
  overlay.classList.toggle("active")
  body.classList.toggle("menu-abierto")

  if (!nav.querySelector(".menu-close")) {
    const closeBtn = document.createElement("button")
    closeBtn.className = "menu-close"
    closeBtn.innerHTML = "×"
    closeBtn.onclick = toggleMenu
    nav.appendChild(closeBtn)
  }
}

function manejarEnlaceActivo() {
  const enlaces = document.querySelectorAll(".navbar nav a")

  enlaces.forEach((enlace) => {
    enlace.addEventListener("click", function () {
      enlaces.forEach((link) => link.classList.remove("active"))
      this.classList.add("active")

      document.querySelector(".navbar nav").classList.remove("active")
      const overlay = document.querySelector(".menu-overlay")
      if (overlay) overlay.classList.remove("active")
      document.body.classList.remove("menu-abierto")
    })
  })
}

function irAlCarrito() {
  const carrito = document.querySelector(".carrito")
  if (carrito) {
    carrito.scrollIntoView({ behavior: "smooth" })
  }
}

document.addEventListener("DOMContentLoaded", () => {
  manejarEnlaceActivo()

  const primerEnlace = document.querySelector(".navbar nav a")
  if (primerEnlace) {
    primerEnlace.classList.add("active")
  }

  document.querySelectorAll(".ver-ingredientes").forEach((button) => {
    button.addEventListener("click", () => {
      const ingredientes = button.nextElementSibling
      ingredientes.classList.toggle("mostrar")
      button.textContent = ingredientes.classList.contains("mostrar") ? "Ocultar ingredientes" : "Ver ingredientes"
    })
  })

  document.querySelectorAll(".navbar nav a").forEach((link) => {
    link.addEventListener("click", () => {
      document.querySelector(".navbar nav").classList.remove("active")
      const overlay = document.querySelector(".menu-overlay")
      if (overlay) overlay.classList.remove("active")
      document.body.classList.remove("menu-abierto")
    })
  })

  document.querySelectorAll(".seleccionar-sabor-btn").forEach((boton) => {
    boton.addEventListener("click", () => {
      const lista = boton.nextElementSibling
      lista.classList.toggle("oculto")
    })
  })

  document.querySelectorAll(".agregar").forEach((boton) => {
    boton.addEventListener("click", () => {
      const producto = boton.closest(".producto")
      const nombre = boton.getAttribute("data-nombre")
      const precio = Number.parseFloat(boton.getAttribute("data-precio"))
      const saborSelect = producto.querySelector(".select-sabor")
      const sabor = saborSelect ? saborSelect.value : null
      
      // NUEVA FUNCIONALIDAD: Obtener la cantidad del input
      const cantidadInput = producto.querySelector(".cantidad")
      const cantidad = cantidadInput ? parseInt(cantidadInput.value) || 1 : 1

      if (saborSelect && !sabor) {
        alert("Por favor seleccioná un sabor antes de agregar al carrito.")
        return
      }

      // Validar que la cantidad sea válida
      if (cantidad < 1) {
        alert("La cantidad debe ser mayor a 0.")
        return
      }

      const nombreCompleto = sabor ? `${nombre} (Sabor: ${sabor})` : nombre

      // Buscar si el producto ya existe en el carrito
      const productoExistente = carrito.find(item => item.nombre === nombreCompleto)
      
      if (productoExistente) {
        // Si existe, sumar la cantidad
        productoExistente.cantidad += cantidad
      } else {
        // Si no existe, agregarlo con la cantidad especificada
        carrito.push({ 
          nombre: nombreCompleto, 
          precio: precio,
          cantidad: cantidad
        })
      }

      actualizarCarrito()

      if (saborSelect) {
        saborSelect.parentElement.classList.add("oculto")
      }

      // Resetear la cantidad a 1 después de agregar
      if (cantidadInput) {
        cantidadInput.value = 1
      }

      console.log(`Agregado al carrito: ${cantidad}x ${nombreCompleto} - $${(precio * cantidad).toFixed(2)}`)
    })
  })
})