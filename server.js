const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// This is the API route (logic) to get notes
app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading notes:', err);
            return res.status(500).json({ error: 'Failed to read notes' });
        }
        res.json(JSON.parse(data));
    });
});

// This is the API route (logic) to post a new note
app.post('/api/notes', (req, res) => {
    const newNote = {
        id: uuidv4(),
        title: req.body.title,
        text: req.body.text,
    };

    fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading notes:', err);
            return res.status(500).json({ error: 'Failed to read notes' });
        }

        const notes = JSON.parse(data);
        notes.push(newNote);

        fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(notes), (err) => {
            if (err) {
                console.error('Error writing notes:', err);
                return res.status(500).json({ error: 'Failed to save note' });
            }
            res.json(newNote);
        });
    });
});

// This is the API route (logic) to delete a note
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;

    fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading notes:', err);
            return res.status(500).json({ error: 'Failed to read notes' });
        }

        let notes = JSON.parse(data);
        notes = notes.filter(note => note.id !== noteId);

        fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(notes), (err) => {
            if (err) {
                console.error('Error writing notes:', err);
                return res.status(500).json({ error: 'Failed to delete note' });
            }
            res.json({ message: 'Note deleted' });
        });
    });
});

// This is the HTML route to serve notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

// This is the Catch-all route to serve index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
