const fs = require('fs');
const { isObject } = require('util');
const administrador=true;

module.exports = class contenedor {
    constructor(productos) {
        this.productos = productos;
    }
        getAll = async() => {
        const contenido = await fs.promises.readFile(this.productos, 'utf-8')
        if (contenido) {
            return (JSON.parse(contenido))
        } else {
            console.log(`Error al querer leer el archivo `)
        }
    }
    save = async(object) => {
        try {
            const contenido = await fs.promises.readFile(this.productos, 'utf-8')
            const arrayEmpty = [];
            const random= Math.floor(Math.random() * (10000-1+1) + 1);
            if (contenido.length === 0) {
                const id = 1;
                const newproduct = { title: object.title, price: object.price, thumbnail: object.thumbnail, description: object.description, timestamp: Date.now(),stock: object.stock, codigo: random, id: id }
                arrayEmpty.push(newproduct)
                await fs.promises.writeFile(this.productos, JSON.stringify(arrayEmpty, null, 4))
            } else {
                const producto = JSON.parse(contenido)
                const LastId=(producto.length)-1
                const id=(producto[LastId].id)+1
                const newproduct = { title: object.title, price: object.price, thumbnail: object.thumbnail, description: object.description, timestamp: Date.now(),stock: object.stock, codigo: random, id: id }
                producto.push(newproduct)
                await fs.promises.writeFile(this.productos, JSON.stringify(producto, null, 4))
            }
        } catch (err) {
            console.log(`Error al querer leer el archivo ${err}`)
        }
    }
    deleteAll() {
        const newArray = "";
        fs.writeFileSync(this.productos, newArray)
    }
    getById= async(number) => {
        try {
            const contenido = await fs.promises.readFile(this.productos, 'utf-8')
            const productos = JSON.parse(contenido);
            const findId = productos.findIndex(element => element.id == number)
            if (findId != -1) {
                return (productos[findId])
            } else {
                console.log(`No se encontro el producto`)
            }

        } catch (err) {
            console.log(`Error al querer leer el archivo ${err}`)
        }
    }
    deleteById = async(number) => {
        try {
            const contenido = await fs.promises.readFile(this.productos, 'utf-8')
            const productos = JSON.parse(contenido);


            if (parseInt(number) > productos.length) {
                console.log(`No se encontro el id ${number}`)

            } else {
                const findId = productos.filter(element => element.id != number)
                await fs.promises.writeFile(this.productos, JSON.stringify(findId, null, 4))
                return findId;
            }
        } catch (err) {
            console.log(`Error al querer leer el archivo ${err}`)
        }
    }
    getRandom = async() => {
        const contenido = await fs.promises.readFile(this.productos, 'utf-8')
        const producto = JSON.parse(contenido)
        const id = await (Math.floor(Math.random() * (producto.length)) + 1)
        if (id <= producto.length) {
            return (this.getById(id));
        } else
            console.log("error")
    }

    updateProduct = async(number, updates) => {
        try {
            const contenido = await fs.promises.readFile(this.productos, 'utf-8')
            const productos = JSON.parse(contenido);
            const findId = productos.findIndex(element => element.id == number)
            if (findId != -1) {
                productos[findId].title = updates.title;
                productos[findId].price = updates.price;
                productos[findId].thumbnail = updates.thumbnail;
                productos[findId].description = updates.description;
                productos[findId].stock = updates.stock;
                const newproduct = { title: productos[findId].title, price: productos[findId].price, thumbnail: productos[findId].thumbnail,description: productos[findId].description,stock: productos[findId].stock }
                await fs.promises.writeFile(this.productos, JSON.stringify(productos, null, 4))
            } else {
                console.log(`No se encontro el producto`)
            }

        } catch (err) {
            console.log(`Error al querer leer el archivo ${err}`)
        }
    }
    saveCarrito=async()=>{
        try{
            const contenido = await fs.promises.readFile(this.productos, 'utf-8')
            const arrayEmpty = [];
            if (contenido.length === 0) {
                const carro = 1;
                 const carrito = {id: carro,productos:[]}
                arrayEmpty.push(carrito)
                await fs.promises.writeFile(this.productos, JSON.stringify(arrayEmpty, null, 4))
            } else {
                const carrito = JSON.parse(contenido)
                const LastId=(carrito.length)-1
                const carro=(carrito[LastId].id)+1
                
                const idcarrito = {id:carro,productos:[]}
                carrito.push(idcarrito)
                await fs.promises.writeFile(this.productos, JSON.stringify(carrito, null, 4))
            }
        } catch (err) {
            console.log(`Error al querer leer el archivo ${err}`)
        }
        }
        saveProductsCarrito=async(producto,id)=>{
            try{
            const contenido = await fs.promises.readFile(this.productos, 'utf-8')
            const productos = JSON.parse(contenido);
            if (contenido.length>=id){
            productos[(id-1)].productos.push(producto)
             await fs.promises.writeFile(this.productos, JSON.stringify(productos,null,4))
            }
            else{
                console.log("carro no encontrado")
            }
        }
            catch (err) {
                console.log(`Error al querer leer el archivo ${err}`)
            }
            
        }

        eliminarProdDeCarro = async (elNumeroCarro, elNumeroProd) =>{
            const contenido = await fs.promises.readFile(this.productos, 'utf-8')
            const carros2 = JSON.parse(contenido);
            let i =0;
            let position = -1
            for(i=0; i < carros2.length; i++){
                if(carros2[i].id == elNumeroCarro){
                    position = i
                    i = carros2.length;
                }
            }
            if(position === -1){
                console.log("Carrito no encontrado")
            } else{
                let auxiliar = carros2[position];
                let auxiliar2 = auxiliar.productos.filter(element => element.id != elNumeroProd)
                carros2[position].productos = auxiliar2;
                let newArray = JSON.stringify(carros2, null, 2)
                await fs.promises.writeFile(this.productos, newArray, "utf-8")
            }
        }
    }
