const express = require("express");
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const app = express();
const port = 3003;
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Habilita el procesamiento de form-data
require('dotenv').config();

const uri = process.env.CADENA;

console.log("Conectando a:", uri);
mongoose.connect(process.env.CADENA, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000  // Aumenta el tiempo de espera
}).then(() => {
  console.log('Conexión exitosa a mongoDB Atlas');
}).catch(err => {
  console.error('Error de conexión atlas:', err);
});

// Middleware para parsear el cuerpo de las solicitudes en formato JSON
app.use(express.json());
app.use(express.static('public'));
// Servir la carpeta de uploads como pública
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/fotos', express.static('uploads'));
app.set('view engine','ejs');
app.set('views', './views');
const modeloProducto = require('./models/producto');
const User = require("./models/User");

//Actualizar producto desde la tabla
app.get('/update_producto', (req, res) => {
  const id = req.query.id;
  modeloProducto.buscaPorId(id)
  .then(
    producto=>res.render('actualiza', { producto })
  )
  .catch(err=>res.status(500).send("error"))
});

app.post('/update_producto', upload.single('foto'), (req, res) => {
  const { id, nombre, precio, categoria } = req.body;
  const foto = req.file ? req.file.filename : null;
  console.log("soy la foto :" + foto)
  modeloProducto.buscaPorId(id).then(producto => {
    if (producto) {
      producto.nombre = nombre;
      producto.precio = precio;
      producto.categoria = categoria;
      if (foto) {
        console.log("donde me meti")
        producto.foto = "uploads/" +  req.file.filename;
        console.log(req.file.filename)
      }
      
      producto.save()
        .then(() => res.redirect('/productos.html'))
        .catch(err => res.status(500).send("Error al actualizar el producto"));
    } else {
      res.status(404).send('Producto no encontrado');
    }
  }).catch(err => res.status(500).send("Error en la búsqueda del producto"));
});

//registro de usuario
app.post('/registro', upload.single('foto'), (req, res) => {
  const { name, email, password } = req.body;

  // Encriptar contraseña
  bcrypt.genSalt(10)
    .then(salt => bcrypt.hash(password, salt))
    .then(hashedPassword => {
      // Crear usuario
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        foto: req.file.filename
      });


      // Guardar usuario
      return newUser.save();
    })
    .then(() => {
      res.json({ message: 'Usuario registrado correctamente' });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Error al registrar usuario' });
    });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

 User.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(400).json({ message: 'Credenciales inválidas' });
      }


      // Comparar contraseñas
      return bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (!isMatch) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
          }
          res.json({ success: true, message: 'Usuario autenticado correctamente', usuario :  user });
        });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Error al iniciar sesión' });
    });
});


// Obtener todos los ítems
app.get("/items", (req, res) => {
  modeloProducto.buscaTodos()
  .then(
    productos=>res.status(200).json(productos)
  )
  .catch(err=>res.status(500).send("error"))
});




// Crear un nuevo ítem
app.post("/items", upload.single('foto'), (req, res) => {
  const nombre = req.body.nombre;
  const precio = req.body.precio;
  const categoria = req.body.categoria;
  const foto = req.file.path;  // Ruta donde se guarda la imagen

  // Llamar al método para crear el nuevo producto
  modeloProducto.creaNuevoProducto(nombre, precio, categoria, foto)
      .then(producto => {
          // Respuesta exitosa
          res.status(200).json({
              success: true, // Indicamos que la operación fue exitosa
              message: "Producto insertado correctamente",
              producto: producto // Enviamos el objeto producto
          });
      })
      .catch(err => {
          // Si ocurre un error, se maneja y responde con error
          res.status(500).json({
              success: false,  // Indicamos que hubo un error
              message: "Error al insertar el producto", 
              error: err.message // Enviamos el mensaje del error
          });
      });
});

// Eliminar un ítem
app.delete("/items/:id", (req, res) => {
  const itemId = req.params.id;
  modeloProducto.borraProducto(itemId)
  .then(
    producto=>res.status(200).json(producto)
  )
  .catch(err=>res.status(500).send("error"))

});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
