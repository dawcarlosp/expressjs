// Using Node.js `require()`
const mongoose = require('mongoose');


//definimos el esquema del documento
const productoSchema = new mongoose.Schema({
    nombre:String,
    precio:Number,
    categoria:String,
    foto:String
});
//creamos el modelo

const Producto = mongoose.model('Producto',productoSchema, 'productos'); 

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
        return producto;
      } else {
        console.log('No se encontró ningún registro con el id'+ id);
        return null;
      }
    })
    .catch(err=>{console.error('Error al obtener el producto' + id,err);
      throw err;
    });
  }


  const creaNuevoProducto = ( m , p, c, f) =>{
    const nuevoProducto = new Producto({
        nombre: m,
        precio: p,
        categoria: c,
        foto: f
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


  module.exports = {  creaNuevoProducto,buscaTodos,buscaPorId }
