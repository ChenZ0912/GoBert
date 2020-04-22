const { ApolloServer } = require('apollo-server-express');
const express = require('express');
var favicon = require('serve-favicon');



const expressPlayground = require('graphql-playground-middleware-express').default
const mongoose = require('mongoose');
const path = require('path');

const cors = require('cors');
const app = express();
app.use(cors());

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolver');
const { MONGODB } = require('./config.js');

const PORT = process.env.PORT || 4000;

const server = new ApolloServer({
	typeDefs,
	resolvers,
	// so that we can access req header in context
	context: ({ req }) => ({ req })
});

app.use(express.static('public'));
app.use(favicon('favicon.ico'));
// graphql playground
app.get('/playground', expressPlayground({ endpoint: '/graphql' }))

app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
})

server.applyMiddleware({ app });

mongoose
	.connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log('MongoDB Connected');
		return app.listen({ port: PORT });
	})
	.then((res) => {
		console.log(`Server started on port ${PORT}`)
	})
