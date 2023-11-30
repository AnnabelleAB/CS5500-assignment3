/**
 * the server for the DocumentHolder
 * 
 * this is an express server that provides the following routes:
 * 
 * GET /documents
 * 
 * GET /documents/:name
 * 
 * PUT /document/request/cell/:name/:cell
 * 
 * PUT /document/release/token/:name/:token
 * 
 * PUT /document/add/token/:name/:token
 * 
 * PUT /document/add/cell/:name/:cell
 * 
 * PUT /document/remove/token/:name
 * 
 * PUT /document/clear/formula/:name
 * 
 * GET /document/formula/string/:name
 * 
 * GET /document/result/string/:name
 * 
 * GET /document/editstatus/:name
 */

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { DocumentHolder } from '../Engine/DocumentHolder';
import { PortsGlobal } from '../ServerDataDefinitions';
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue, Filter, QuerySnapshot } from 'firebase-admin/firestore';
import { ChatItem } from './ChatItem';


// define a debug flag to turn on debugging
let debug = true;

// define a shim for console.log so we can turn off debugging
if (!debug) {
    console.log = () => { };
}


const app = express();
app.use(cors());
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', 'http://pencil.local:3000');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//     next();
// });
app.use(bodyParser.json());

// Add a middleware function to log incoming requests
app.use((req, res, next) => {
    if (debug) {
        console.log(`${req.method} ${req.url}`);
    }
    next();
});

//Add firestore database


const serviceAccount = require('../serviceAccountKey.json');

initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();

const documentHolder = new DocumentHolder();

// GET /documents
app.get('/documents', (req: express.Request, res: express.Response) => {
    const documentNames = documentHolder.getDocumentNames();
    res.send(documentNames);
});

// PUT /documents/:name
// userName is in the document body
app.put('/documents/:name', (req: express.Request, res: express.Response) => {
    console.log('PUT /documents/:name');
    const name = req.params.name;
    // get the userName from the body
    console.log(`PUT /documents/:name ${name}`);
    const userName = req.body.userName;
    if (!userName) {
        res.status(400).send('userName is required');
        return;
    }


    // is this name valid?
    const documentNames = documentHolder.getDocumentNames();


    if (documentNames.indexOf(name) === -1) {
        console.log(`Document ${name} not found, creating it`);
        documentHolder.createDocument(name, 5, 8, userName);
    }

    // get the document
    const document = documentHolder.getDocumentJSON(name, userName);

    res.status(200).send(document);
});

app.get('/debug', (req: express.Request, res: express.Response) => {
    debug = !debug
    console.log(`debug is ${debug}`);
    res.status(200).send(`debug is ${debug}`);

});

app.post('/documents/reset', (req: express.Request, res: express.Response) => {
    documentHolder.reset();
    res.status(200).send('reset');
});

app.post('/documents/create/:name', (req: express.Request, res: express.Response) => {
    const name = req.params.name;

    // get the userName from the body
    const userName = req.body.userName;

    // is this name valid?
    const documentNames = documentHolder.getDocumentNames();
    if (documentNames.indexOf(name) === -1) {
        const documentOK = documentHolder.createDocument(name, 5, 8, userName);
    }
    documentHolder.requestViewAccess(name, 'A1', userName);
    const documentJSON = documentHolder.getDocumentJSON(name, userName);

    res.status(200).send(documentJSON);

});



app.put('/document/cell/edit/:name', (req: express.Request, res: express.Response) => {
    const name = req.params.name;

    // is this name valid?
    const documentNames = documentHolder.getDocumentNames();
    if (documentNames.indexOf(name) === -1) {
        res.status(404).send(`Document ${name} not found`);
        return;
    }
    // get the user name from the body
    // get the cell from the body
    const userName = req.body.userName;
    const cell = req.body.cell;
    if (!userName) {
        res.status(400).send('userName is required');
        return;
    }
    // request access to the cell
    const result = documentHolder.requestEditAccess(name, cell, userName);
    const documentJSON = documentHolder.getDocumentJSON(name, userName);

    res.status(200).send(documentJSON);
});

app.put('/document/cell/view/:name', (req: express.Request, res: express.Response) => {
    const name = req.params.name;

    // is this name valid?
    const documentNames = documentHolder.getDocumentNames();
    if (documentNames.indexOf(name) === -1) {
        res.status(404).send(`Document ${name} not found`);
        return;
    }
    // get the user name from the body
    const userName = req.body.userName;
    const cell = req.body.cell;
    if (!userName) {
        res.status(400).send('userName is required');
        return;
    }
    // request access to the cell
    const result = documentHolder.requestViewAccess(name, cell, userName);

    const documentJSON = documentHolder.getDocumentJSON(name, userName);

    res.status(200).send(documentJSON);
});

app.put('/document/addtoken/:name', (req: express.Request, res: express.Response) => {
    const name = req.params.name;
    // is this name valid?
    const documentNames = documentHolder.getDocumentNames();
    if (documentNames.indexOf(name) === -1) {
        res.status(404).send(`Document ${name} not found`);
        return;
    }
    // get the user name from the body, and get the token from the body
    const userName = req.body.userName;
    const token = req.body.token;
    if (!userName) {
        res.status(400).send('userName is required');
        return;
    }
    // add the
    const resultJSON = documentHolder.addToken(name, token, userName);


    res.status(200).send(resultJSON);
});

app.put('/document/addcell/:name', (req: express.Request, res: express.Response) => {
    const name = req.params.name;


    // is this name valid?
    const documentNames = documentHolder.getDocumentNames();
    if (documentNames.indexOf(name) === -1) {
        res.status(404).send(`Document ${name} not found`);
        return;
    }
    // get the user name  and the cell from the body
    const userName = req.body.userName;
    const cell = req.body.cell;
    if (!userName) {
        res.status(400).send('userName is required');
        return;
    }
    // add the token
    const resultJSON = documentHolder.addCell(name, cell, userName);


    res.status(200).send(resultJSON);
});

app.put('/document/removetoken/:name', (req: express.Request, res: express.Response) => {
    const name = req.params.name;
    // is this name valid?
    const documentNames = documentHolder.getDocumentNames();
    if (documentNames.indexOf(name) === -1) {
        res.status(404).send(`Document ${name} not found`);
        return;
    }
    // get the user name from the body
    const userName = req.body.userName;
    if (!userName) {
        res.status(400).send('userName is required');
        return;
    }
    // remove the tokenn
    const resultJSON = documentHolder.removeToken(name, userName);


    res.status(200).send(resultJSON);
});

// PUT /document/clear/formula/:name
app.put('/document/clear/formula/:name', (req: express.Request, res: express.Response) => {
    const name = req.params.name;
    // is this name valid?
    const documentNames = documentHolder.getDocumentNames();
    if (documentNames.indexOf(name) === -1) {
        res.status(404).send(`Document ${name} not found`);
        return;
    }
    // get the user name from the body
    const userName = req.body.userName;
    if (!userName) {
        res.status(400).send('userName is required');
        return;
    }
    // clear the formula
    const resultJSON = documentHolder.clearFormula(name, userName);

    res.status(200).send(resultJSON);
});



//20 Message api 
app.get('/messages', (req: express.Request, res: express.Response) => {
    const lastFetchedTimestamp = req.query.lastFetchedTimestamp;
    let query = db.collection('messages').orderBy('timestamp', 'desc');

    if (lastFetchedTimestamp) {
        query = query.startAfter(lastFetchedTimestamp);
    }

    query.limit(20).get()
        .then(snapshot => {
            const messages = snapshot.docs.map(doc => doc.data());
            res.status(200).send(messages);
        }).catch((error) => {
            console.error('Error retrieving messages:', error);
            res.status(500).send('Error retrieving messages');
        });
});

app.get('/all-messages', (req: express.Request, res: express.Response) => {
    let filteredWords = documentHolder.getFilterWords();
    let query = null;
    if (filteredWords.length == 0) {
        query = db.collection('messages')
        .orderBy('timestamp', 'desc');
    } else {
        query = db.collection('messages')
        .orderBy('content')
        .where('content', 'not-in', filteredWords)
        .orderBy('timestamp', 'desc');
    }
    query.get()
        .then(snapshot => {
            const messages = snapshot.docs.map(doc => doc.data());

            //second filter case insensitive
            let filteredResult: FirebaseFirestore.DocumentData[] = [];
            messages.forEach((message) => { 
                if (!filteredWords.some(word => message.content.toLowerCase().includes(word))) {
                    filteredResult.push(message);
                }
            })
            res.status(200).send(filteredResult);
        })
        .catch(error => {
            console.error('Error retrieving all messages:', error);
            res.status(500).send('Error retrieving messages');
        });
});


app.get('/messages_by_page', (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    db.collection('messages')
        .orderBy('timestamp', 'desc')
        .offset(offset)
        .limit(limit)
        .get()
        .then(snapshot => {
            const messages = snapshot.docs.map(doc => doc.data());
            if (messages.length <= 0) {
                res.status(404).send('No messages found');
                return;
            }
            res.status(200).send(messages);
        })
        .catch(error => {
            console.error('Error retrieving messages:', error);
            res.status(500).send('Error retrieving messages');
        });
});

app.post('/messages', (req: express.Request, res: express.Response) => {
    const userName = req.body.userName;
    if (!userName) {
        res.status(400).send('userName is required for a message');
        return;
    }

    const content = req.body.content;
    if (!content) {
        res.status(400).send('content is required for a message');
        return;
    }

    db.collection('messages').add({
        content: content,
        user: userName,
        timestamp: Date.now()
    }).then(
        result => {
            res.status(200).send(result.id);
        }
    ).catch((error) => {
        console.error('Error adding message:', error);
        res.status(500).send('Error adding message');
    })
});

app.get('/filtered-words', (req: express.Request, res: express.Response) => {
    const filterWords = documentHolder.getFilterWords();
    res.send(filterWords);
});

app.post('/filtered-words', (req: express.Request, res: express.Response) => {
    const filteredWord = req.body.filteredWord;

    if (!filteredWord) {
        res.status(400).send('filterWord is required for a message');
        return;
    }

    // add the token
    const filteredWords = documentHolder.addWord(filteredWord);
    res.status(200).send(filteredWords);
});


// get the port we should be using
const port = PortsGlobal.serverPort;
// start the app and test it
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
