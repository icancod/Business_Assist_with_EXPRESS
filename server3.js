import express from 'express';
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });
import fs from 'fs';
import path from 'path';
import connection from './dbconn.js';
import cors from 'cors';
import transporter from './mailconn.js';
const app = express();

app.use(cors());
app.use(express.json());
//app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads')); // Serve static files from the uploads directory

app.post("/send-email", (req, res) => {
  const { to, subject, text } = req.body;
  const mailOptions = { 
    from: process.env.EMAIL_USER,
    to,
    subject,
    text
  };
    transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ error: 'Failed to send email' });
    }
    console.log("Email sent:", info.response);
    res.json({ message: 'Email sent successfully' });
  });
});

app.get("/users", (req, res) => {
  connection.query('SELECT * FROM users', (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json({ users: results });
  });   
});

// insert user
app.post("/users", upload.single('profilepicture'),(req, res) => {
    const { name, email, phone, productcategory,  servicelevel  } = req.body;
    if (!name || !email || !phone || !productcategory || !req.file || !servicelevel) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const profilepicturedata = req.file.path;  // Get the path of the uploaded file
    connection.query(
        'INSERT INTO users (full_name, email,phone, product_category, profile_pic, service_level) VALUES (?, ?, ?, ?, ?, ?)',
        [name, email, phone, productcategory, profilepicturedata, servicelevel],
        (error, results) => {
            if (error) {
                return res.status(500).json({ error: 'Database insert failed' });
            }
            res.status(201).json({ message: 'User created successfully', userId: results.insertId });
}
    );
});

// Update user
app.put("/users/:id",upload.single('profilepicture'),(req, res) => {
    const userId = req.params.id;
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);

    const { name, email, phone, productcategory, servicelevel } = req.body;
    if (!name || !email || !phone || !productcategory || !servicelevel) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const profilepicturepath = req.file ? req.file.path : null; // Get the path of the uploaded file if it exists
   
    const query = `
    UPDATE users
    SET full_name = ?, email = ?, phone = ?, product_category = ?, service_level = ? 
    ${profilepicturepath ? ', profile_pic = ?' : ''}
    WHERE id = ?
`;


    const params = profilepicturepath
        ? [name, email, phone, productcategory, servicelevel, profilepicturepath, userId]
        : [name, email, phone, productcategory, servicelevel, userId];

    connection.query(query, params, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Database update failed' });
        }   
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User updated successfully' });
    });
});

// Delete user
app.delete("/users/:id", (req, res) => {
    const userId = req.params.id;
    connection.query(
        'DELETE FROM users WHERE id = ?',
        [userId],
        (error, results) => {
            if (error) {
                return res.status(500).json({ error: 'Database delete failed' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json({ message: 'User deleted successfully' });
        }
    );
});

// download user data
app.get("/download/:id", (req, res) => {
    const userId = req.params.id;

    connection.query(
        'SELECT full_name, profile_pic FROM users WHERE id = ?',
        [userId],
        (error, results) => {
            if (error || results.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            const filePath = results[0].profile_pic;
            if (!filePath || !fs.existsSync(filePath)) {
                return res.status(404).json({ error: 'File not found' });
            }

            const filename = path.basename(filePath); 
            res.download(filePath, filename); 
        }
    );
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
