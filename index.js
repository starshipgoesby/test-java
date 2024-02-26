const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.post('/create-job', async (req, res) => {
    const jobName = req.body.jobName;
    const jobDescription = req.body.jobDescription;

    // Configurasi Jenkins
    const JENKINS_URL = 'http://localhost:8080/'; // Ganti dengan URL Jenkins Anda
    const JENKINS_USERNAME = 'admin'; // Ganti dengan username Jenkins Anda
    const JENKINS_API_TOKEN = '11c700b5b79906cbefc96e4eb070e555c5'; // Ganti dengan API token Jenkins Anda

    // Contoh konfigurasi job dalam XML
    const jobConfigXml = `
    <project>
        <description>${jobDescription}</description>
        <builders>
            <hudson.tasks.Shell>
                <command>echo "Hello, world!"</command>
            </hudson.tasks.Shell>
        </builders>
    </project>
    `;

    try {
        const response = await axios.post(`${JENKINS_URL}/createItem?name=${jobName}`, jobConfigXml, {
            auth: {
                username: JENKINS_USERNAME,
                password: JENKINS_API_TOKEN
            },
            headers: {
                'Content-Type': 'application/xml'
            }
        });
        res.send(`Job "${jobName}" berhasil dibuat!`);
    } catch (error) {
        res.status(500).send('Gagal membuat job');
    }
});

// Server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
