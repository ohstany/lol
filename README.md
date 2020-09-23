# Test project based on React.js and Next.js

League of legends summoner search & statistics dashboard.

## Installation & development deployment

```bash
$ git clone https://github.com/ohstany/lol.git # clone this repo
$ cd lol # jump into the project
$ npm i # or yarn
$ npm run dev # or yarn dev | to start project in development environment
```

## Create production

```bash
$ npm run build # builds production bundle
$ npm run pro # run in production mode, that's it
```

## Templating

Project implemented templating system and from the terminal it is easy to pick up wanted template and start project on top of it. Here are example of entry points in `package.json`

```json
"scripts": {
   "build": "cross-env BUILD='lol' TEMPLATE='lol' API_HOST='https://codingtest.op.gg' API_PREFIX='/api/' ROBOTS='allow' NODE_ENV=production PORT=3000 next build",
   "dev": "cross-env BUILD='lol' TEMPLATE='lol' API_HOST='https://codingtest.op.gg' API_PREFIX='/api/' ROBOTS='allow' NODE_ENV=development PORT=3000 node server.js",
   "pro": "cross-env BUILD='lol' TEMPLATE='lol' API_HOST='https://codingtest.op.gg' API_PREFIX='/api/' ROBOTS='allow' NODE_ENV=production PORT=3000 node server.js"
}
```

Those parameters allowing to pick up wanted project template or switch between projects. Also We are able to set up API domain that our application will be communicated to.

-   `TEMPLATE='lol'` (must be set as lowercase) template variable specifies project's folder in `./src/templates/Lol` path (first letter will be auto capitalized `'lol'` will become `='Lol'`)
-   `API_HOST='https://codingtest.op.gg'` is a path to the api application that built-in api library is going to commuticate with
-   `API_PREFIX='/api/'` api prefix or version

## Folder structure

-   `./src`
    Holds all reusable components, store, files, functions that are commonly shared between application or application templates.

    -   `./src/api`
        Build-in api request library, that behave similar to axios, main feature is that it saves request data directly into global store.
    -   `./src/component`
        Reusable components, widgets and so on.
    -   `./src/files`
        Files that will be encoded as base64 format. You are able to easly inport and use files as `import image from "files/image.png"`
    -   `./src/functions`
        Differs from components, a library of plain javascript functions that are shared across entire project, you are able easly create and import needed function as `import { mergeDeep } from "functions"`. That's it.
    -   `./src/store`
        Global store implemented via Context API. Can create multiple store containers. It provides a method which will perform api request and reduce data into the store via method `actioner` (See below more examples of how to use actiones and how it cooks).

-   `./pages`
    Holds all pages (containers), each file should represent one route. They are automatically routed by their filename, but can have a custom route implemented via Express (see settings at `./server.js`).

    -   `./pages/_app.js`
        Next.js component that is wrapped around every page and doesn't re-render when a route changes. Practical for holding global state that should not be reset on page change, or things like background sounds.
    -   `./pages/_document.js`
        The underlying html for every page render. This is only rendered once on the server and serves as the container for the react app from then on. See [Custom Document](https://github.com/zeit/next.js#custom-document) for more info on customization.
    -   `./pages/index.js`
        Main entry point of application. Router implemented dynamically, every request will be filtered via `./index.js` and then redirected to `./templates/{selected_template}/index.js`

-   `./templates`
    Allow to build separate templates that can be deployed as separate standalone production or development project (to see project templating settings see `./babel.config.js` that identify project and `./next.config.js` that creates bundle with selected template)

-   `./public`
    Holds all static files (fonts / images / videos etc.), can also be used to transfer things like `robots.txt` or `favicon.ico`.

-   `./assets`
    Sass files for `sass-resources` loader. All styling, variables, mixins etc. will be applied along with deployment.

## Usage examples

### actioner

Parameters

-   `reduce` must provide action keyword that reducer will be sticked to. Ex) `reduce: "GET_SUMMONER"`
-   `action` action for api request usually it mean that `api.com/{actionName}?param=1`
-   `data` accept parameters via Object representation Ex) data: { key: "value" }
-   `params` accept parameters via String representation Ex) params: "param1=v1&param2=v2&param3=v3"
-   `api` Boolean value -> whether use api or not `true/false`. If false just manually save some values to the store without accessing api.

Whole usecase

```json
actioner({
   reduce: "GET_BASE_SUMMONER",
   action: `${type}/${value}`,
}).then((out) => console.log("finished"));
```

Possible to do multiple actioners at the same time. Ii will call 3 separate api requests and reduce them to the store.

```json
actioner([
   {
      reduce: "GET_BASE_SUMMONER",
      action: `${type}/${value}`,
   },
   {
      reduce: "GET_SUMMONER_MATCHES",
      action: `${type}/${decodedValue}/matches`,
   },
   {
      reduce: "GET_SUMMONER_MOSTINFO",
      action: `${type}/${decodedValue}/mostInfo`,
   }
]).then((out) => console.log("finished"));
```
