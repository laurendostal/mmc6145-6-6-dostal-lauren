import { withIronSessionApiRoute } from "iron-session/next";
import sessionOptions from "../../config/session"
import db from '../../db'

// this handler runs for /api/book with any request method (GET, POST, etc)
export default withIronSessionApiRoute(
  async function handler(req, res) {
    // TODO: On a POST request, add a book using db.book.add with request body 
    // TODO: On a DELETE request, remove a book using db.book.remove with request body 
    // TODO: Respond with 404 for all other requests
    // User info can be accessed with req.session
    // No user info on the session means the user is not logged in
    const book = req.body
    const user = req.session.user
    switch(req.method) {
      case 'POST':
        if (!user) {
          return res.status(401).end();
        }
        try {
          const bookAdded = await db.book.add(user.id, book);
          if (bookAdded) {
            return res.status(200).json("book added")
          } else {
            req.session.destroy()
            return res.status(401).json({ error: "book not added" });
          }
        } catch (error) {
          return res.status(400).json({ error: error.message })
        }
      
      case 'DELETE':
        if (!user) {
          return res.status(401).end();
        }
        try {
          const bookRemoved = await db.book.remove(user.id, book.id);
          if (bookRemoved) {
            return res.status(200).json("book removed")
          } else {
            req.session.destroy()
            return res.status(401).json({ error: "book not removed" })
          }
        } catch (error) {
          return res.status(400).json({ error: error.message });
        }
    }
    return res.status(404).end()
  },
  sessionOptions
)
