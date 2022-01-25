import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import Sequelize from "sequelize";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
// import authorization from './Middleware/authorization';



dotenv.config();
const app = express();

// middleware
app.use(cors());

const server_port = process.env.SERVER_PORT;
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false
});

// set data models

const User = sequelize.define('User', {
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        default: 0,
        allowNull: false,
    },
    isAdministrator: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        default: false
    }
}, {
    freezeTableName: true,
    tableName: 'User',

});
await User.sync({ alter: true, force: false });

let admin = await User.findOne({where: {username: 'admin'}});
if (!admin) {
    User.create({
        username: "admin",
        password: "admin@admin",
        email: process.env.SUPPORT_EMAIL,
        isAdministrator: true
    });
}


const Note = sequelize.define('Note', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        default: 0,
        allowNull: false
    },
    text: {
        type: Sequelize.STRING,
        allowNull: true
    }

}, {
    freezeTableName: true
});
Note.belongsTo(User);
await Note.sync({ alter: true, force: false });

// Middleware

const authorization = (req, res, next) => {
    try{
        const token = req.header("token");
        if (!token){
            return res.status(403).json("Not Authorized");
        }

        const payload = jwt.verify(token, process.env.JWT_KEY);
        req.user = payload;

        const user = User.findOne({where: {
                id: req.user.id
        }});

        if (user === null || user === undefined) {
            req.user = undefined;
            return res.status(403).json("Not Authorized");
        }

        next();

    }catch (err){
        console.error(err.message);
        return res.status(403).json("Not Authorized");
    }
}

// routes
let router = express.Router();

app.use(express.json());

// signup route
router.post('/signup', async (req, res) => {

    try {
        const { username, password, email } = req.body;

        // check if same username exists
        if (await User.findOne({ where: { username: username } }) !== null) {
            return res.status(400).json( {"error": "This username already exists!"} );
        }

        // bcrypt the user password
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const bcryptPassword = await bcrypt.hash(password, salt);

        // Insert the new user into DB
        const newUser = await User.create({
            username: username,
            password: bcryptPassword,
            email: email,
            isAdministrator: false
        });
        res.status(200).send(newUser);

    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error")
    }

});

// login route
router.post("/login", async (req, res) => {

    try{
        const {username, password} = req.body
        const user = await User.findOne({
            where: {
                username: username
            }
        });

        // check if the user exists
        if (user == null) {
            return res.status(401).json({"error": 'username or password is incorrect!'});
        }

        // check if the password is incorrect
        const correctPassword = await bcrypt.compare(password, user.password);
        if (!correctPassword){
            return res.status(401).json({"error": "username or password is incorrect!"});
        }

        // giving token
        const payload = {user: user.id};
        const token = jwt.sign(payload, process.env.JWT_KEY);
        res.json({token});

    } catch (err) {
        console.error(err.message);
    }
});
app.use("/auth", router);

// notes

app.use(express.json());

router.get("/list", authorization, async (req, res) => {
    try{
        const user_id = req.user.user;
        const userOfNote = User.findOne({ where : {id : user_id} });
        if (userOfNote.isAdministrator){
            const list = await Note.findAll({})
            res.status(200).json({ 'list': list });
        }
        else{
            const list = await Note.findAll({ where : {UserId : user_id}})
            res.status(200).json({ 'list': list });
        }
    }catch (err){
    }
});


router.post("/new", authorization, async (req, res) => {
    let newNote = null;
    try{
        const text = req.body.text;
        const user_id = req.user.user;
        console.log(user_id);
        newNote = await Note.create({
            text: text,
            UserId: user_id
        });
        console.log(newNote.id);
        res.status(200).json(newNote.id);
    }catch (err){
    }
});



router.put('/:id', authorization, async (req, res) => {

    try{
        const {id} = req.params;
        const {text} = req.body;
        const note = await Note.findOne({where : { id : id}});
        const user_id = req.user.user;
        if (user_id !== note.UserId && !req.user.isAdministrator) {
            res.status(401).json({ "error" : "Access is not allowed!" });
        } else {
            const newText = text;
            await note.update({ text: newText });
            await note.save();
            res.status(200).send(note);
        }
    }catch (err){
    }
});

router.delete("/:id", authorization, async (req, res) => {
    try{
        const { id } = req.params;
        const user_id = req.user.user;
        const note = await Note.findOne({where : {id : id}});
        console.log(note);
        if(user_id !== note.UserId && !req.user.isAdministrator){
            res.status(401).json({ "error" : "Access is not allowed!" });
        }else{
            await Note.destroy({where : {id: id}});
            res.status(200).json("Note is deleted" );
        }

    }catch (err){
    }
});

app.use("/notes", router);

app.listen(server_port, 'localhost', () => (
    console.log(`server is running on port ${server_port}`)
));