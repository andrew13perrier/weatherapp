const path = require("path")
const express = require("express")
const { isAbsolute } = require("path")
const hbs = require("hbs")
const geocode = require("./utils/geocode")
const forecast = require("./utils/forecast")


const app = express()
const port = process.env.PORT || 3000

//Define paths for Express config
const publicDirectoryPath= path.join(__dirname, "../public")
const viewPath = path.join(__dirname,"../templates/views")
const partialsPath = path.join(__dirname, "../templates/partials")

//Setup handlebars engine and views location
app.set("view engine", "hbs")
app.set("views", viewPath)
hbs.registerPartials(partialsPath)

//Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get("", (req, res) => {
    res.render("index", {
        title: "Weather",
        name: "Andrew P"
         
    })
})

app.get("/about", (req, res) => {
    res.render("about", {
        title: "About me",
        name: "Andrew P"
        
    })
})

app.get("/help", (req, res) => {
    res.render("help", {
        msg: "What do you need help with?",
        title: "Help",
        name: "Andrew P"
        
    })
})


app.get("/weather", (req, res )=> {
    if(!req.query.address){
        return res.send({
            error: "You must provide an address"
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location}={}) => {
        if (error){
            return res.send({error})
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error){
                return res.send({error})
            }
            
            res.send({
                forecast :forecastData,
                location,
                address: req.query.address
            })
        })
    })

})

app.get("/products", (req, res)=> {
    if (!req.query.search) {
         return res.send({
            error: "You must provide a search term"
        })
    }

    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get("/help/*", (req, res) => {
    res.render("404", {
        title: "Error",
        name: "Drew P",
        errorMessage:"Help article not found"
    })
})

app.get("*", (req, res) => {
    res.render("404",{
        title: "Error",
        name: "Drew P",
        errorMessage:"Page not found"
    })
})


app.listen(port, ()=> {
    console.log("Server is up on port 3000" + port)
