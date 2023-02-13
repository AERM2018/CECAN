## Cómo ejecutarla
Esta aplicación de servidor se ejecuta en un contenedor docker, por lo que es necesario tener docker instalado para poder ejecutarla.


1. Estando en la raíz del proyecto (/)
2. Localice y abra el archivo next.config.js
3. Dentro archivo verifique que tenga el mismo contenido al que se le muestra enseguida:
```
module.exports = {
  reactStrictMode: true,
  env: {
    NEXTAUTH_URL: TEXTO_AQUI,
    API_BASE_URL: TEXTO_AQUI,
    PORT: NUMERO
  },
};
```
### **NOTAS:** 

El valor de la clave "NEXTAUTH_URL" debe de ser "http://localhost" seguido de ":" y el puerto donde se estará ejecutando la aplicación. 
Por ejemplo: "http://localhost:80", siendo 80 el puerto. 

Considere que el puerto que especifique en la clave antes mencionada debe ser el mismo que el que se ponga en
la clave "PORT", de lo contrario la aplicación no funcionará.

El valor de la clave "API_BASE_URL" también debe de ser "http://locahost" seguido de ":"
y el puerto donde esta siendo ejecutada la API, por defecto será el puerto ***4000***. Si tiene dudas acerca del puerto, consulte esta información con la persona
que ejecutó el proyecto. Si el puerto cambió, esta aplicación web no podrá conectarse con la API, por lo tanto no tendrá acceso a la información almacenada en
la base de datos.

-----------------------------------

4. En la raíz del proyecto encontrará un archivo llamado "Dockerfile" sin ninguna extesión de archivo, abralo y vayase al final de archivo, suba un poco y localice el siguiete texto:
```
# Production image, copy all the files and run next
```
Asegurese que en las siguientes lineas al texto antes mencionado este el proximo texto:
```
ENV NODE_ENV production
ENV PORT 80
ENV NEXTAUTH_SECRET "THISISMYSECRET"
```
Debe de asegurarse de que en la linea que dice "ENV PORT" el número que sigue, es decir, el 80 por ejemplo, sea el mismo que configuró en el archivo "next.config.js" antes mencionado en el paso no. 3.

Guarde el archivo y salgase.

5. Una vez configurado el archivo antes mencionado y estando en la raíz del proyecto, hay que ejecutar el siguiente comando
```
  docker build . -t cecan-app
``` 

Verá como se ejecuten una serie de comandos, al finalizar verá un texto que le indicará que la construcción de la image a sido terminada.

#### **Nota:** Este paso debe ser repetido cada vez que algún elemento de este proyecto sea modificado, de lo contario usted no verá reflejado los cambios en la aplicación final.

6.Una vez que la imagen haya sido creada correctamente, ejecutará el siguiente comando:
```
docker run -p 80:80 -d --name cecan-app-pro cecan-app:latest
```

#### **Nota:** 
El texto que esta después de "-p" es el puerto donde será ejectada la aplicación, debe de asegurase que ambos números sean iguales y que sean los mismos que ya
declaró en los archivos anteriores de configuración. El no hacer esto podrá hacer que la aplicación no se ejecute de manera correcta.


7. Ejecuta el comando ```docker ps```, el verás la lista de los contenedores que se están ejecutando actualmente, deberías ver un contenedor que tiene el nombre de "cecan-app-pro".
8. Finalmente, puedes acceder al contenedor en los puertos especificados, 
en la tabla que muestra el comando ```dokcer ps``` verás algo como ```0.0.0.0:80-->80``` en la fila de la tabla que corresponda al contenedor que acabas de montar, 
el lado izquierdo de la cadena corresponde al puerto que usas en la máquina local para conectarte al contenedor, y el lado derecho es el puerto dentro del contenedor que se está usando.
