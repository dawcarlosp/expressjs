# Usar una imagen base oficial de Node.js
FROM node:18

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos de la aplicación al contenedor
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Crear la carpeta uploads 
RUN mkdir -p /app/uploads

 # Establecer permisos para que la app pueda escribir en uploads 
RUN chmod -R 777 /app/uploads

# Exponer el puerto que usa la aplicación
EXPOSE 3003

# Comando para ejecutar la aplicación
CMD ["node", "server.js"]
