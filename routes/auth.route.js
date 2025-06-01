import express from "express"
import jwt from "jsonwebtoken"
import { OAuth2Client } from "google-auth-library"
import User from "../models/user.model.js"

const router = express.Router()
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

router.post("/google", async (req, res) => {
  const { token } = req.body
  if (!token) return res.status(400).json({ message: "Token missing" })

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    const { sub: googleId, email, name, picture } = payload

    let user = await User.findOne({ googleId })
    if (!user) {
      user = await User.create({ googleId, email, name, picture })
    }

    const sessionToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.json({ token: sessionToken, user })
  } catch (err) {
    console.error("Google Auth Error:", err)
    res.status(401).json({ message: "Invalid Google Token" })
  }
})

export default router
