const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");



const prisma = new PrismaClient();

exports.SignUp = async (req, res) => {
    const {username, email, password} = req.body;

    try {

        const existingUser = await prisma.user.findUnique({
            where: { email }
        })
        if (existingUser) {
            return res.status(400).json({message: "This email is already in use"})
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
        
       await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
       })
        res.status(201).json({message: "Account created successfully"})
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Something went wrong"})
    }

}

exports.Login = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: {email}
        })
        if (!user) {
            return res.status(404).json({message: "User not found"})
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({message: "Invalid credentials"})
        }

        const token = jwt.sign({
            userId: user.id,
            email: user.email
        }, process.env.JWT_SECRET, {expiresIn: "7d"})
        res.status(200).json({message: "Login successful", token})
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Something went wrong"})
    }
}