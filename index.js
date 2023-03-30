const http = require('http');
const fs = require('fs')

let url = require('url');
const port = 3009
const host = '127.0.0.1'

const replaceTemplate = (temp, product) => {
    output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%ID%}/g, product.id);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    if (!product.organic) output = output.replace(/{%NOT-ORGANIC%}/g, 'not-organic');

    return output;
}



const tempOverview = fs.readFileSync(`${__dirname}/template/template-overview.html`, 'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/template/template-product.html`, 'utf-8')
const tempcard = fs.readFileSync(`${__dirname}/template/template-card.html`, 'utf-8')
const data = fs.readFileSync(`${__dirname}/data.json`, 'utf-8')
const productData = JSON.parse(data)

const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true);

    //homePage 
    if (pathname === "/" || pathname === "/overview") {
        res.writeHead(200, {
            'Content-type': 'text/html'
        })
        const cardsHTML = productData.map(ele => replaceTemplate(tempcard, ele)).join('')
        const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHTML)

        res.end(output);
        // product page 
    } else if (pathname === "/product") {
        res.writeHead(200, {
            'Content-type': 'text/html'
        })
        const product = productData[query.id];
        const output = replaceTemplate(tempProduct, product)
        res.end(output);
    }
    //api page
    else if (pathname === "/api") {
        res.writeHead(200, {
            'Content-type': 'application/json'
        })
        res.end(data);
    }
    //not found
    else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'MHM'
        })
        res.end('<h1>ERROR 404</h1>');
    }




})
server.listen(port, host, () => {
    console.log(`server running on host ${host} on port ${port}`)
})