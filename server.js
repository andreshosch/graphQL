const express = require("express");
const { Router } = express;
const app = express();
const { graphqlHTTP } =require ("express-graphql");
const { buildSchema }=require("graphql");
const crypto=require ("crypto");
const routerProductos = Router();
const routerCarrito = Router();
const contenedor = require('./archivos')
const Archivos = new contenedor('productos.json')
const carrito=new contenedor('carrito.json')
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
let administrador=true //VARIABLE QUE CONTROLA SI SE EJECUTA LAS PETICIONES O NO

const isAdmin=(req,res,next)=>{
    if (administrador){
        return next()
    }
    else{
          const response={
            error:-1,
            description: `Ruta ${req.path} y método ${req.method} no autorizados`
          } 
          res.status(401).json(response)
      }
    }
    const schema = buildSchema(`
  type Product {
    id: ID!
    title: String
    price: String
    stock: String
    description: String
  }

  input ProductInput {
    title: String
    price: String
    stock: String
    description: String
  }

  type Query {
    getProduct(id: ID!): Product
    getProducts(campo: String, valor: String): [Product]
  }

  type Mutation {
    saveProducts(datos: ProductInput): Product
    updateProducts(id: ID!, datos: ProductInput): Product
    deleteProducts(id: ID!): Product
  }
`);

class product {
    constructor (id, {title, price,stock,description}) {
      this.id = id;
      this.title = title;
      this.price = price;
      this.stock = stock;
      this.description = description;
    }
  }

  const productsContainer = {};
// ESCUCHANDO EN PUERTO 8080
const PORT = 8080;
const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`)
});
server.on("error", error => console.log(`Error: ${error}`))

app.use("/api/productos", routerProductos);
app.use("/api/carrito", routerCarrito);

//TRAER TODOS LOS PRODUCTOS CON METODO GET
function getProduct({id}){
    if (!productsContainer[id]) {
        throw new Error('Products not found');
       }
       return productsContainer[id];
    }

//TRAER UN PRODUCTO POR ID
function getProducts({ campo, valor }){
    const products = Object.values(productsContainer);
    if (campo && valor) {
      return products.filter( p => p[campo] === valor);
    } else return products;
}
//GUARDAR NUEVO PRODUCTO
function saveProducts({datos}){
    const id = crypto.randomBytes(10).toString('hex');
    const newProducts = new product(id, datos);
    productsContainer[id] = newProducts;
    return newProducts;
}

//ACTUALIZAR PRODUCTO MEDIANTE ID
function updateProducts({id,datos}){
    if (!productsContainer[id]) {
        throw new Error('Products not found')
      }
      const updatedProducts = new product(id, datos);
      productsContainer[id] = updatedProducts;
      return updatedProducts;
}
//ELIMINAR PRODUCTO POR ID
function deleteProducts(){
    if (!productsContainer[id]) {
        throw new Error('Products not found')
      }
      const deletedProducts = productsContainer[id];
      delete productsContainer[id];
      return deletedProducts;
}


app.use("/graphql", graphqlHTTP({
  schema,
  rootValue: {
    getProduct,
    getProducts,
    saveProducts,
    updateProducts,
    deleteProducts
  },
  graphiql: true,
}));