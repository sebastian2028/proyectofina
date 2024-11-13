// Variables para manejar el scroll infinito y la cantidad de productos cargados
let productosPorPagina = 15;
let indiceActual = 0;

// Función para registrar la compra en index.html
function registrarCompra() {
  const nombre = document.getElementById("nombre").value.trim();
  const presupuesto = parseFloat(document.getElementById("presupuesto").value);
  const cantidad = parseInt(document.getElementById("cantidad").value, 10);
  const direccion = document.getElementById("direccion").value.trim();
  const tipoEntrega = document.getElementById("tipoEntrega").value;

  // Validaciones
  if (!nombre || nombre.length > 20) {
    alert("El nombre es obligatorio y no debe superar los 20 caracteres.");
    return;
  }

  if (!presupuesto || isNaN(presupuesto) || presupuesto <= 0) {
    alert("El presupuesto debe ser un número positivo.");
    return;
  }

  if (!cantidad || isNaN(cantidad) || cantidad <= 0 || cantidad > 20) {
    alert(
      "La cantidad de productos debe ser un número positivo y no debe superar los 20."
    );
    return;
  }

  if (!direccion) {
    alert("La dirección de entrega es obligatoria.");
    return;
  }

  if (!tipoEntrega) {
    alert("Por favor, selecciona un tipo de entrega.");
    return;
  }

  // Guardar los datos en localStorage
  const compraData = {
    nombre,
    presupuesto,
    cantidad,
    direccion,
    tipoEntrega,
  };
  localStorage.setItem("compraData", JSON.stringify(compraData));

  // Mensaje de confirmación
  alert(
    `Registro de compra completado:\nNombre: ${nombre}\nPresupuesto: $${presupuesto.toLocaleString(
      "es-ES"
    )}\nCantidad de productos: ${cantidad}\nDirección: ${direccion}\nTipo de entrega: ${
      tipoEntrega === "domicilio" ? "A Domicilio" : "Retiro en tienda"
    }`
  );

  // Redirigir a vista2.html
  window.location.href = "vista2.html";
}

// Asignar la función al botón de registro de compra
const registrarCompraBtn = document.getElementById("registrarCompraBtn");
if (registrarCompraBtn) {
  registrarCompraBtn.addEventListener("click", registrarCompra);
}

// Carga inicial de productos en vista2.html
document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname.includes("vista2.html")) {
    const compraData = JSON.parse(localStorage.getItem("compraData"));

    if (compraData) {
      console.log("Datos de la compra:", compraData);
      cargarProductos(); // Llama a la función para cargar productos al iniciar vista2.html
    } else {
      alert("No se encontraron datos de la compra. Regresando al formulario.");
      window.location.href = "index.html";
    }
  }
});

// Función para cargar productos (scroll infinito)
function cargarProductos() {
  const contenedorProductos = document.getElementById("productosLista");

  for (
    let i = indiceActual;
    i < indiceActual + productosPorPagina && i < motos.length;
    i++
  ) {
    const moto = motos[i];
    const productoDiv = document.createElement("div");
    productoDiv.classList.add("producto");
    productoDiv.innerHTML = `
      <img src="${moto.foto}" alt="${moto.nombre}" class="producto-imagen" />
      <h3>${moto.nombre}</h3>
      <p>${moto.marca}</p>
      <p>Precio: $${moto.precio}</p>
      <button onclick="verDetalles(${moto.id})">Ver Detalles</button>
    `;
    contenedorProductos.appendChild(productoDiv);
  }

  indiceActual += productosPorPagina;
}

// Función de scroll infinito
window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    cargarProductos();
  }
});
if (document.getElementById("productosLista")) {
  cargarProductos();
}

// Función para mostrar los detalles del producto seleccionado
function verDetalles(id) {
  const moto = motos.find((m) => m.id === id);
  const detalleProducto = document.getElementById("detalleProducto");

  if (moto) {
    document.getElementById("detalleImagen").src = moto.foto;
    document.getElementById("detalleNombre").textContent = moto.nombre;
    document.getElementById(
      "detalleMarca"
    ).textContent = `Marca: ${moto.marca}`;
    document.getElementById(
      "detallePrecio"
    ).textContent = `Precio: $${moto.precio}`;
    document.getElementById(
      "detalleCategoria"
    ).textContent = `Categoría: ${moto.categoria}`;
    document.getElementById("detalleTipo").textContent = `Tipo: ${moto.tipo}`;
    document.getElementById("cantidadProducto").value = 1; // Resetear cantidad al mostrar un nuevo producto

    // Mostrar la sección de detalles
    detalleProducto.classList.remove("hidden");
    detalleProducto.style.display = "block";
  } else {
    // Ocultar la sección de detalles si no hay producto seleccionado
    detalleProducto.classList.add("hidden");
    detalleProducto.style.display = "none";
  }
}
function cerrarDetalle() {
  const detalleProducto = document.getElementById("detalleProducto");
  detalleProducto.classList.add("hidden");
  detalleProducto.style.display = "none";
}

// Función de filtrado de productos
function filtrarProductos() {
  const filtroCategoria = document.getElementById("filtroCategoria").value;
  const filtroTipo = document.getElementById("filtroTipo").value;
  const contenedorProductos = document.getElementById("productosLista");
  contenedorProductos.innerHTML = ""; // Limpiar el contenedor

  const productosFiltrados = motos.filter((moto) => {
    const cumpleCategoria =
      filtroCategoria === "todos" || moto.categoria === filtroCategoria;
    const cumpleTipo = filtroTipo === "todos" || moto.tipo === filtroTipo;
    return cumpleCategoria && cumpleTipo;
  });

  productosFiltrados.forEach((moto) => {
    const productoDiv = document.createElement("div");
    productoDiv.classList.add("producto");
    productoDiv.innerHTML = `
      <img src="${moto.foto}" alt="${moto.nombre}" class="producto-imagen" />
      <h3>${moto.nombre}</h3>
      <p>${moto.marca}</p>
      <p>Precio: $${moto.precio}</p>
      <button onclick="verDetalles(${moto.id})">Ver Detalles</button>
    `;
    contenedorProductos.appendChild(productoDiv);
  });
}

// Función para limpiar filtros y mostrar todos los productos
function limpiarFiltros() {
  document.getElementById("filtroCategoria").value = "todos";
  document.getElementById("filtroTipo").value = "todos";
  indiceActual = 0;
  document.getElementById("productosLista").innerHTML = "";
  cargarProductos();
}

// Funciones de la barra de navegación
function cancelarCompra() {
  // Eliminar la información del registro de la compra y los productos del carrito de localStorage
  localStorage.removeItem("compraData");
  localStorage.removeItem("carrito");

  // Mostrar un mensaje de confirmación
  alert(
    "La compra ha sido cancelada. Se borraron los datos del registro y los productos del carrito."
  );

  // Redirigir al usuario a la página inicial
  window.location.href = "index.html";
}

// Función completarCompra que redirige a vista3.html
function completarCompra() {
  alert("Compra completada. Redirigiendo al carrito...");
  // Simplemente redirigir a vista3.html; cargarCarrito() se ejecutará al cargar la página
  window.location.href = "vista3.html";
}

// Carga inicial de productos en caso de que el archivo se cargue directamente en vista2.html

function continuarComprando() {
  window.location.href = "vista2.html"; // Ajusta el enlace si es necesario
}

document
  .getElementById("fechaExpiracion")
  .addEventListener("input", function (e) {
    let input = e.target.value.replace(/\D/g, ""); // Eliminar caracteres no numéricos
    if (input.length > 4) {
      input = input.slice(0, 4); // Limitar a 4 caracteres
    }

    // Formatear a MM/AA automáticamente
    if (input.length > 2) {
      input = input.slice(0, 2) + "/" + input.slice(2);
    }

    e.target.value = input; // Actualizar el campo con el formato correcto
  });

// Validación al confirmar la compra
document
  .getElementById("fechaExpiracion")
  .addEventListener("input", function (e) {
    let input = e.target.value.replace(/\D/g, ""); // Eliminar caracteres no numéricos
    if (input.length > 4) {
      input = input.slice(0, 4); // Limitar a 4 caracteres
    }

    // Formatear a MM/AA automáticamente
    if (input.length > 2) {
      input = input.slice(0, 2) + "/" + input.slice(2);
    }

    e.target.value = input; // Actualizar el campo con el formato correcto
  });

// Validación al confirmar la compra
// Evento de entrada para formatear automáticamente la fecha de expiración
document
  .getElementById("fechaExpiracion")
  .addEventListener("input", function (e) {
    let input = e.target.value.replace(/\D/g, ""); // Eliminar caracteres no numéricos
    if (input.length > 4) {
      input = input.slice(0, 4); // Limitar a 4 caracteres
    }

    // Formatear a MM/AA automáticamente
    if (input.length > 2) {
      input = input.slice(0, 2) + "/" + input.slice(2);
    }

    e.target.value = input; // Actualizar el campo con el formato correcto
  });

// Evento de entrada para validar que el número de tarjeta solo acepte números
document
  .getElementById("numeroTarjeta")
  .addEventListener("input", function (e) {
    e.target.value = e.target.value.replace(/\D/g, ""); // Remover cualquier caracter no numérico
  });

// Evento de entrada para validar que el nombre del titular solo acepte letras
document
  .getElementById("nombreTitular")
  .addEventListener("input", function (e) {
    e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ""); // Remover caracteres no alfabéticos
  });

// Función para confirmar la compra
function confirmarCompra() {
  const numeroTarjeta = document.getElementById("numeroTarjeta").value.trim();
  const fechaExpiracion = document
    .getElementById("fechaExpiracion")
    .value.trim();
  const codigoSeguridad = document
    .getElementById("codigoSeguridad")
    .value.trim();
  const nombreTitular = document.getElementById("nombreTitular").value.trim();
  const paisEmision = document.getElementById("paisEmision").value;
  const tipoTarjeta = document.getElementById("tipoTarjeta").value;

  // Validación del número de tarjeta
  const tarjetaRegex = /^\d{16}$/;
  if (!tarjetaRegex.test(numeroTarjeta)) {
    alert("El número de tarjeta debe contener exactamente 16 dígitos.");
    return;
  }

  // Validación de la fecha de expiración
  const fechaRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  if (!fechaRegex.test(fechaExpiracion)) {
    alert("La fecha de expiración debe estar en el formato MM/AA.");
    return;
  }

  // Verificar que el año de la fecha de expiración sea mayor o igual a '24'
  const [mes, año] = fechaExpiracion.split("/").map(Number);
  if (año < 24) {
    alert("El año de expiración debe ser 24 o superior.");
    return;
  }

  // Validación del código de seguridad (CVC)
  const cvcRegex = /^\d{3}$/;
  if (!cvcRegex.test(codigoSeguridad)) {
    alert("El código de seguridad debe contener exactamente 3 dígitos.");
    return;
  }

  // Validación del nombre del titular (solo letras)
  const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  if (!nombreRegex.test(nombreTitular)) {
    alert("El nombre del titular solo debe contener letras y espacios.");
    return;
  }

  // Validación de otros campos
  if (
    !paisEmision ||
    paisEmision === "all" ||
    !tipoTarjeta ||
    tipoTarjeta === "all"
  ) {
    alert("Por favor, completa todos los campos del formulario.");
    return;
  }

  // Simulación de validación y confirmación de la compra
  alert("Procesando la compra... Por favor, espera.");
  setTimeout(() => {
    alert("Compra confirmada. El pago fue realizado con éxito.");
    window.location.href = "index.html"; // Redirigir a la página de inicio
  }, 3000);
}

// Función para agregar productos al carrito
function agregarAlCarrito() {
  const cantidad = parseInt(
    document.getElementById("cantidadProducto").value,
    10
  );
  const nombreProducto = document.getElementById("detalleNombre").textContent;

  if (nombreProducto) {
    const moto = motos.find((m) => m.nombre === nombreProducto);
    if (moto) {
      let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      const compraData = JSON.parse(localStorage.getItem("compraData"));

      if (!compraData) {
        alert(
          "No se encontraron datos de la compra. Por favor, regresa al formulario."
        );
        return;
      }

      const cantidadMaxima = parseInt(compraData.cantidad, 10);
      const presupuestoMaximo = parseFloat(compraData.presupuesto);
      const cantidadActualEnCarrito = carrito.reduce(
        (total, item) => total + item.cantidad,
        0
      );
      const totalActualEnCarrito = carrito.reduce(
        (total, item) => total + item.precio * item.cantidad,
        0
      );

      // Verificar si la cantidad total de productos supera el límite permitido
      if (cantidadActualEnCarrito + cantidad > cantidadMaxima) {
        alert(
          `No puedes agregar más de ${cantidadMaxima} productos al carrito.`
        );
        return;
      }

      // Verificar si el precio total del carrito supera el presupuesto máximo
      const nuevoTotalConProducto =
        totalActualEnCarrito + moto.precio * cantidad;
      if (nuevoTotalConProducto > presupuestoMaximo) {
        alert(
          `No puedes agregar este producto al carrito porque excede tu presupuesto máximo de $${presupuestoMaximo.toLocaleString(
            "es-ES"
          )}.`
        );
        return;
      }

      // Añadir producto al carrito con la cantidad ingresada
      const productoCarrito = {
        id: moto.id,
        nombre: moto.nombre,
        marca: moto.marca,
        precio: moto.precio,
        cantidad: cantidad,
        foto: moto.foto, // Asegúrate de incluir esta línea
      };

      const index = carrito.findIndex((item) => item.id === moto.id);
      if (index !== -1) {
        carrito[index].cantidad += cantidad;
      } else {
        carrito.push(productoCarrito);
      }

      localStorage.setItem("carrito", JSON.stringify(carrito));
      alert(
        `Producto ${moto.nombre} agregado al carrito con cantidad: ${cantidad}`
      );
    } else {
      alert("No se pudo encontrar el producto seleccionado.");
    }
  } else {
    alert("No hay un producto seleccionado para agregar al carrito.");
  }
}
function cargarCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const compraData = JSON.parse(localStorage.getItem("compraData"));

  const tbody = document.querySelector("#tablaCompra tbody");
  tbody.innerHTML = ""; // Limpiar contenido previo

  if (carrito.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center;">El carrito está vacío. Agrega productos desde la página de productos.</td></tr>`;
    document.getElementById("totalProductos").textContent = 0;
    document.getElementById("totalCompra").textContent = "$0";
    document.getElementById("costoEnvio").textContent = "$0";
    document.getElementById("totalFinal").textContent = "$0";
    return;
  }

  let totalProductos = 0;
  let totalCompra = 0;
  const costoEnvio = compraData && compraData.tipoEntrega === "domicilio" ? 15000 : 0;

  carrito.forEach((producto) => {
    const totalProducto = producto.precio * producto.cantidad;
    totalProductos += producto.cantidad;
    totalCompra += totalProducto;

    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td><img src="${producto.foto}" alt="${producto.nombre}" style="width: 50px; height: auto;"></td>
      <td>${producto.nombre}</td>
      <td>${producto.marca}</td>
      <td>${producto.cantidad}</td> <!-- Mostrar cantidad aquí (cambiado de "Total" a "Cantidad") -->
      <td>$${totalProducto.toLocaleString("es-ES")}</td> <!-- Mostrar total aquí (cambiado de "Cantidad" a "Total") -->
      <td><button onclick="eliminarProducto(${producto.id})">Eliminar</button></td>
    `;
    tbody.appendChild(fila);
  });

  document.getElementById("totalProductos").textContent = totalProductos;
  document.getElementById("totalCompra").textContent = `$${totalCompra.toLocaleString("es-ES")}`;
  document.getElementById("costoEnvio").textContent = `$${costoEnvio.toLocaleString("es-ES")}`;
  document.getElementById("totalFinal").textContent = `$${(totalCompra + costoEnvio).toLocaleString("es-ES")}`;
}

// Función para eliminar un producto del carrito
function eliminarProducto(id) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito = carrito.filter((producto) => producto.id !== id);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  cargarCarrito(); // Recargar la tabla del carrito
}

document.addEventListener("DOMContentLoaded", function () {
  cargarCarrito();
});
