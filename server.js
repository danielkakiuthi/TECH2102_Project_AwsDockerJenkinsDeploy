const fs = require('fs');
const exists = require('fs').exists;
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'src/message')));


app.get('/', (req, res)=> {
    const filePath = path.join(__dirname, 'src/page', 'message.html');
    res.sendFile(filePath);
});

app.get('/exists', (req, res)=>{
    const filePath = path.join(__dirname, 'src/page', 'exists.html');
    res.sendFile(filePath);
})

app.get('/past-messages', (req, res)=>{
    const messageFolder = path.join(__dirname, 'src/message');
    console.log(messageFolder);

    let result = `<p>messageFolder: ${messageFolder}</p><p>My List:</p><ul>`;
    
    // fs.promises.readdir(messageFolder)
    //     .then(filenames => {
    //         for (let filename of filenames) {
    //             console.log(filename)
    //             result += `<li>${filename}</li>`
    //         }
    //         res.send({"body": result});
    //     })
    //     .catch(err => {
    //         console.log(err)
    //     })

    fs.promises.readdir(messageFolder)
        .then(filenames => {
            res.send(filenames);
        })
        .catch(err => {
            console.log(err)
        })


})

app.post('/create', async(req, res) =>{
    const title = req.body.title;
    const text = req.body.text;

    const tempFilePath = path.join(__dirname, 'src/temp', title + '.txt');
    const finalFilePath = path.join(__dirname, 'src/message', title + '.txt');

    await fs.promises.writeFile(tempFilePath, text);
    exists(finalFilePath, async(exists) =>{
        if(exists){
            res.redirect('/exists');
        }
        else{
            //await fs.promises.rename(tempFilePath, finalFilePath);
            await fs.promises.copyFile(tempFilePath, finalFilePath);
            await fs.promises.unlink(tempFilePath)
            res.redirect('/');
        }
    });
});


app.post('/delete', async(req, res) => {
    const filename = req.body.filenameToDelete;

    const finalFilePath = path.join(__dirname, 'src/message', filename);
    exists(finalFilePath, async(exists) =>{
        if(exists){
            await fs.promises.unlink(finalFilePath)
            res.redirect('/');
        }
    });
});

app.listen(3000);




// To build: "docker build -t my-image-01 ."
// To run docker (hot load): "docker run -d --rm -p 3000:3000 --name my-container-01 -v /${PWD}:/code my-image-01" 
// To find the name: docker ps
// TO stop: "docker stop my-container-01"