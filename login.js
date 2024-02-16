const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path=require('path');
const session = require('express-session');
const app = express();
const port = 3000;

app.use(session({
    secret: 'mykey',
    resave: false,
    saveUninitialized: true,
}));

// PostgreSQL connection pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'root',
    port: 5432,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('html'));



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/html/login.html');
});

app.post('/login', async (req, res) => {
    const { userName, userPassword ,dropdown} = req.body;

    try {
        const selectQuery = 'SELECT user_name FROM users WHERE user_name = $1';
        const passQuery = 'SELECT password FROM users WHERE user_name = $1';
        const userId ='SELECT oid FROM users WHERE user_name = $1';
        const userRole ='SELECT role FROM users WHERE user_name = $1';
        console.log(userName);
        console.log(dropdown);

        const userResult = await pool.query(selectQuery, [userName]);
        const name = userResult.rows[0];
        const passwordResult = await pool.query(passQuery, [userName]);
        const Id = await pool.query(userId, [userName]);
        const user = Id.rows[0];
        const Role = await pool.query(userRole, [userName]);
        console.log(Role.rows[0].role);
        console.log(userRole);
        if (userResult.rows.length > 0 && userPassword === passwordResult.rows[0].password && dropdown == Role.rows[0].role) {

            if(dropdown == 'User') {
            //Storing id and name in session
            req.session.userNo = user.oid;
            req.session.Name = name.user_name;
            console.log(req.session.userNo);
            console.log("Login successful");
            res.redirect('/myhome');
            } else {
                console.log("Currently Not Available");
            }

            if(dropdown == 'Admin') {
                res.redirect('/admin');
            }
            else {
                console.log("Unable to fetch");
            }

        } else {
            const msg = `
            <h3>Invalid Credentials </h3>
            <p>Click the link below to go back</p>
            <a href="/login.html" target="_self">Back to Login Page</a>
        `;
            res.send(msg);
        }

    } catch (error) {
        console.error(error);
        res.status(500).send("Error processing login");
    }
});

//home
app.get('/myhome', (req, res) => {
        const userId = req.session.userNo;
        if (userId) {
            res.sendFile(path.join(__dirname, 'html', 'home.html'));
        } else {
            res.redirect('/');
        }
});

app.post('/gotoregister', async(req, res) => {
    try {
            var { userName, userPassword, emailID, phoneNo} = req.body;
            var Userrole = 'User';
            // Insert user registration data into the database
            const insert = 'INSERT INTO users (user_name, password, emailid, phone_no,role) VALUES ($1, $2, $3, $4,$5)';
            await pool.query(insert,[userName, userPassword, emailID, phoneNo, Userrole]);
            const success = `
                <h3> User registered successfully </h3>
                <p>Click the link below to go back</p>
                <a href="/login.html" target="_self">Go to Login Page</a>
            `;
                res.send(success);
        } catch (err) {
            if (err) {
                console.error(err);
                const error = `
                <h3> Error registering user </h3>
                <h2>Please try a different mail and phone no!</h2>
                <p>Click the link below to go back</p>
                <a href="/register.html" target="_self">Go back to Registration Page</a>
            `;
                res.status(500).send(error);
            } else {
                const success = `
                <h3> User registered successfully </h3>
                <p>Click the link below to go back</p>
                <a href="/login.html" target="_self">Go to Login Page</a>
            `;
                res.send(success);
            }
        }
});

//home
app.post('/signin', async (req, res) => {
    const userId = req.session.userNo;
    const name = req.session.Name;
    try {
        var today =new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yy= today.getFullYear();
        var formattedDate = dd + "-" +  mm + "-" + yy;

        var hours = today.getHours();
        var min = today.getMinutes();
        var sec = today.getSeconds();
        var logtime = hours + ':' + min + ':' + sec;

        var status = 'Signed In';
        
        const insertQuery = 'INSERT INTO attendance (userid,username,date,login_time,login_status) VALUES ($1,$2,$3,$4,$5)';
        await pool.query(insertQuery, [userId,name,formattedDate,logtime,status]);
        console.log("Success");
        res.status(200).send({ message: 'Sign-in successful', datetime: formattedDate });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.put('/signout', async (req, res) => {
    const userId = req.session.userNo;
    const name = req.session.Name;
    try {
        
        var today =new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yy= today.getFullYear();
        var formattedDate = dd + "-" +  mm + "-" + yy;

        var hours = today.getHours();
        var min = today.getMinutes();
        var sec = today.getSeconds();
        var logtime = hours + ':' + min + ':' + sec;
        var status = 'Signed Out';
        // Insert date and time into the database
        const updateQuery = 'UPDATE attendance SET logout_time = $1 , logout_status =$2 WHERE date = $3 AND userid =$4 AND username=$5';
        await pool.query(updateQuery, [logtime,status,formattedDate,userId,name]);
        console.log("SignedOut");
        res.status(200).send({ message: 'Sign-out successful', datetime: formattedDate });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/users', async (req, res) => {
    const userId = req.session.userNo;
    const name = req.session.Name;
    try {
        const fetchData = 'SELECT * FROM attendance WHERE username=$1 AND userid=$2 ';
        const result = await pool.query(fetchData,[name,userId]);
        const users = result.rows[0];
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/html/admin.html');
});

app.get('/api/admin', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users,attendance WHERE users.oid = attendance.userid');
        const users = result.rows;
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});