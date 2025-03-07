// Using Node.js `require()`
const mongoose = require('mongoose');


//definimos el esquema del documento
const productoSchema = new mongoose.Schema({
    nombre:String,
    precio:Number
});
//creamos el modelo

const Producto = mongoose.model('Producto',productoSchema, 'productos'); 
const buscaPrimero = ()=>{
    //buscamos el primer registro
  return Producto.findOne()
    .then( producto =>{
      if (producto) {
        console.log('Primer ordenador encontrado',producto);
      } else {
        console.log('No se encontró ningún registro')
      }
    })
    .catch(err=>console.error('Error al obtener el producto',err));
  }

  const buscaTodos = ()=>{
    //buscamos todos los registros
  return Producto.find()
    .then( productos=>{
      if (productos.length>0) {
        console.log('Productos encontrados',productos);
        return productos;
      } else {
        console.log('No se encontró ningún registro');
        return null;
      }
    })
    .catch(err=>{console.error('Error al obtener los productos',err);
      throw err;
    });
  }

  const buscaPorId = (id)=>{
    //buscamos el primer registro
  return Producto.findById(id)
    .then( producto=>{
      if (producto) {
        console.log('Primer producto encontrado',producto);
        return ordenador;
      } else {
        console.log('No se encontró ningún registro con el id'+ id);
        return null;
      }
    })
    .catch(err=>{console.error('Error al obtener el producto' + id,err);
      throw err;
    });
  }

  //***************************** */
// busca por precio mayor a 3000
/****************************** */
const buscaPrecioMayor = (precioMinimo)=>{
    //buscamos todos los registros
    Producto.find({precio: { $gt:precioMinimo}})
    .then( productos=>{
      if (productos.length>0) {
        console.log('Productos encontrados con precio mayor a ' + precioMinimo,productos)
      } else {
        console.log('No se encontró ningún registro')
      }
    })
    .catch(err=>console.error('Error al obtener los productos',err));
  }

  const creaNuevoProducto = ( m , p, c) =>{
    const nuevoProducto = new Producto({
        nombre: m,
        precio: p,
        categoria: c
      });

      // Guardar el ordenador en la base de datos
      return nuevoProducto.save()
        .then(producto => {
          console.log('Producto guardado:', producto);
          return producto;
        } )
        .catch(err => {
          console.error('Error al guardar el producto:', err);
          throw err;
        });

  }
  const creaNuevoProductorGeneral = ( producto) =>{
    const nuevoProducto = new Producto({
        nombre: m,
        precio: p
      });

      // Guardar el producto en la base de datos
      return nuevoProducto.save()
        .then(producto => {
          console.log('Producto guardado:', producto);
          return producto;
        } )
        .catch(err => {
          console.error('Error al guardar el producto:', err);
          throw err;
        });

  }

  const actualizaPrecio = (idProducto,nuevoPrecio) => {
    Producto.findByIdAndUpdate(idProducto, { precio: nuevoPrecio }, { new: true })
    .then(productoActualizado => {
      if (productoActualizado) {
        console.log('Producto actualizado:', productoActualizado);
      } else {
        console.log('No se encontró ningún producto con ese ID.');
      }
    })
    .catch(err => console.error('Error al actualizar el producto:', err));
  }

  const actualizaProducto = (idProducto,productoActualizar) => {
    return Ordenador.findByIdAndUpdate(idProducto, productoActualizar, { new: true })
    .then(productoActualizado => {
      if (productoActualizado) {
        console.log('Producto actualizado:', productoActualizado);
        return productoActualizado;
      } else {
        console.log('No se encontró ningún producto con ese ID.');
        return null;
      }
    })
    .catch(err => console.error('Error al actualizar el producto:', err));
  }

  const borraProducto = (idProductoParaBorrar) =>{
    return Producto.findByIdAndDelete(idProductoParaBorrar)
    .then(productoEliminado => {
      if (productoEliminado) {
        console.log('Producto eliminado:', productoEliminado);
        return productoEliminado;
      } else {
        console.log('No se encontró ningún producto con ese ID.');
        return null;
      }
    })
    .catch(err => {console.error('Error al eliminar el producto:', err);
      throw err;
    });

}
  module.exports = { actualizaProducto, buscaPrimero,buscaTodos,buscaPorId, 
    buscaPrecioMayor, actualizaPrecio, borraProducto, creaNuevoProducto,Producto }
