# Pixel Art: Web client

### Local development

Install all dependencies

```shell
yarn install
```

Setup `.env`

```shell
cp .env.example .env
```

Run local development server

```shell
yarn serve # Starts a server on localhost:3000
```

To lint and prettify all files run

```shell
yarn style
```

Automatic code formatting on file saves, execute this in another terminal instance.

```shell
yarn prettier:watch
```

### Production

```shell
yarn install
yarn build # Creates a dist folder
```
