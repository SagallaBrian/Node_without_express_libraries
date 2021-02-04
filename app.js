const myhttp = require('http');
const usrfs = require("fs");
const { stringify } = require('querystring');
const querystring = require('querystring');

const hostname = '127.0.0.1';
const port = 3000;

let myuservar = [];
const server = myhttp.createServer((req, res) => {

    if (req.method === 'GET' && req.url === '/') {
        usrfs.readFile('./myview/home.html', 'utf8', (err, mydata) => {
            if (err) throw err;
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html'); // 'text/html', 'application/json'
            res.end(mydata);
        });
    }
    else if (req.method === 'GET' && req.url === '/signup') {
        usrfs.readFile('./myview/signup.html', 'utf8', (err, mydata) => {
            if (err) throw err;
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html'); // 'text/html', 'application/json'
            res.end(mydata);
        });
    }
    else if (req.method === 'GET' && req.url === '/login') {
        usrfs.readFile('./myview/login.html', 'utf8', (err, mydata) => {
            if (err) throw err;
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html'); // 'text/html', 'application/json'
            res.end(mydata);
        });
    }
    else if (req.method === 'GET' && req.url === '/wronglogin') {
        usrfs.readFile('./myview/wronglogin.html', 'utf8', (err, mydata) => {
            if (err) throw err;
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html'); // 'text/html', 'application/json'
            res.end(mydata);
        });
    }
    else if (req.method === 'GET' && req.url === '/wrongsignup') {
        usrfs.readFile('./myview/wrongsignup.html', 'utf8', (err, mydata) => {
            if (err) throw err;
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html'); // 'text/html', 'application/json'
            res.end(mydata);
        });
    }
    else if (req.method === 'GET' && req.url === '/logout') {
        myuservar = [];
        res.writeHead(302, {
            location: '/login'
        })
        res.end();
    }

    else if (req.method === 'GET' && req.url === '/correctlogin') {
        if (myuservar.length === 0) {
            res.writeHead(302, {
                location: '/login'
            })
            res.end();
        }
        else {
            usrfs.readFile('./myview/myindex.html', 'utf8', (err, mydata) => {
                if (err) throw err;
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html'); // 'text/html', 'application/json'
                res.end(mydata);
            });
        }
    }

    else if (req.method === 'GET' && req.url === '/signok') {
        usrfs.readFile('./myview/signupok.html', 'utf8', (err, mydata) => {
            if (err) throw err;
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html'); // 'text/html', 'application/json'
            res.end(mydata);
        });
    }
    else if (req.method === 'GET' && req.url === '/gamepoint') {
        usrfs.readFile('./mydb/ques.json', 'utf8', (err, mydata) => {
            if (err) throw err;
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader('Content-Type', 'application/json'); // 'text/html', 'application/json'
            res.end(mydata);
        });
    }
    else if (req.method === 'GET' && req.url === '/checkiflogin') {
        res.setHeader('Content-Type', 'application/json'); // 'text/html', 'application/json'
        let jsonuser = JSON.stringify(myuservar);
        res.end(jsonuser);
    }
    else if (req.method === 'POST' && req.url === '/signupform') {

        req.on('data', (chunk) => {
            let new_user = querystring.parse(chunk.toString());
            let dataret = stroringfunction(new_user);
            if (dataret === 2) {
                req.emit('existsuser');
            }
        }).on("existsuser", () => {
            res.writeHead(302, {
                location: '/wrongsignup'
            })
            res.end();

        }).on('end', () => {
            res.writeHead(302, {
                location: '/signok'
            })
            res.end();
        });

    }
    else if (req.method === 'POST' && req.url === '/login') {
        let datarray = [];
        myuservar = [];
        req.on('data', (chunk) => {
            let log_user = querystring.parse(chunk.toString());
            // mychekfunction(log_user);
            let reslval = mychekfunction(log_user);
            // console.log(reslval);

            if (reslval.length === 0) {
                console.log('The user does not exist');
                req.emit('nouser');
            }
            else {
                myuservar.push(reslval[0].impusernam);
                myuservar.push(reslval[0].impemail);
            }

        }).on("nouser", () => {
            res.writeHead(302, {
                location: '/wronglogin'
            })
            res.end();

        }).on('end', () => {

            res.writeHead(302, {
                location: '/correctlogin'
            })
            res.end();
        });


    }

});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});



// Storing function 
let stroringfunction = (mydata) => {

    let myval = mychekfunction2(mydata);
    if (myval.length === 0) {

        usrfs.readFile('./mydb/users.json', 'utf8', (err, myfiledata) => {
            if (err) throw err;
            let newarray = [];
            let filearray = JSON.parse(myfiledata);
            if (filearray.length !== 0 || filearray.length === null) {
                for (let arraydata of filearray) {
                    newarray.push(arraydata);
                }
                newarray.push(mydata);
                let jsondata = JSON.stringify(newarray);
                usrfs.writeFile('./mydb/users.json', jsondata, 'utf8', (err) => {
                    if (err) throw err;
                    console.log("File Written Successfully");
                });
            }
            else {
                newarray.push(mydata);
                let jsondata = JSON.stringify(newarray);
                usrfs.writeFile('./mydb/users.json', jsondata, 'utf8', (err) => {
                    if (err) throw err;
                    console.log("File Written Successfully");
                });

            }

        });
        return 3 

    }else
    {
        return 2 ;
    }
}


function mychekfunction(loguserparam) {
    try {
        const arraydata = usrfs.readFileSync('./mydb/users.json', { encoding: 'utf8', flag: 'r' });
        let mydataparse = JSON.parse(arraydata);

        let newcheckarr = mydataparse.filter((arrelem, elemindex) => {
            return arrelem.impemail === loguserparam.impemail && arrelem.impass === loguserparam.impass
        });
        return newcheckarr;

    } catch (error) {
        return error;

    }



}

function mychekfunction2(loguserparam) {
    try {
        const arraydata = usrfs.readFileSync('./mydb/users.json', { encoding: 'utf8', flag: 'r' });
        let mydataparse = JSON.parse(arraydata);

        let newcheckarr = mydataparse.filter((arrelem, elemindex) => {
            return arrelem.impemail === loguserparam.impemail
        });
        return newcheckarr;

    } catch (error) {
        return error;

    }

}