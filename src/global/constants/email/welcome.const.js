const WelcomeEmail = (name) => {
  const url = process.env.FE_URL;
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to the Digital Democracy eLearning Course</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 20px;
            }
            .container {
                max-width: 800px;
                margin: auto;
                background-color: white;
                padding: 20px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h1, h2 {
                color: #2c3e50;
            }
            p {
                font-size: 16px;
                line-height: 1.6;
            }
            ul {
                list-style-type: none;
                padding: 0;
            }
            ul li {
                margin-bottom: 10px;
            }
            .faq-question {
                font-weight: bold;
                margin-top: 15px;
            }
            a {
                color: #3498db;
                text-decoration: none;
            }
            .footer {
                margin-top: 20px;
                font-size: 14px;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Welcome to the Digital Democracy eLearning Course!</h1>
            <p>Dear ${name},</p>
    
            <p>Welcome to the Digital Democracy eLearning Course! We’re excited to have you on board 
            as you take the first step in learning how to conduct your own online consultation.</p>
    
            <p>This self-paced course is designed to equip government officials and CSOs with the 
            knowledge and skills needed for effective digital consultations. Here are some frequently 
            asked questions to help you get started:</p>
    
            <h2>FAQs</h2>
            <ul>
                <li><span class="faq-question">1. How many hours is the entire course?</span><br>
                The course takes approximately 6 hours to complete, depending on your pace.</li>
    
                <li><span class="faq-question">2. Is the course free?</span><br>
                Yes, this course is completely free for all registered participants.</li>
    
                <li><span class="faq-question">3. Will I receive an e-certificate?</span><br>
                Yes, you will receive an e-certificate upon successfully completing the course and 
                passing the final test with a score of 80%.</li>
    
                <li><span class="faq-question">4. Who is the course for?</span><br>
                This course is designed for government officials, CSO representatives, and IT 
                professionals involved in digital democracy initiatives.</li>
    
                <li><span class="faq-question">5. What are the modules and how many are there?</span><br>
                The course consists of 6 modules covering topics like Definition, processes, and 
                characteristics of good governance, Assessing the landscape, and more.</li>
    
                <li><span class="faq-question">6. Is the course self-paced?</span><br>
                Yes. While it may take approximately 6 hours to go through all the modules, case studies, templates, and quizzes, the course is self-paced, allowing you to complete it at your own convenience. This course is available until November 2025.</li>
    
                <li><span class="faq-question">7. What is the passing score for the test?</span><br>
                You will need to achieve a score of at least 80% to pass the final test and earn your certificate.</li>
            </ul>
    
            <p>We encourage you to start exploring the course materials and feel free to reach out if 
            you have any questions. You can log in to the course at any time via this link: 
            <a href="${url}/login">${url}/login</a>.</p>
    
            <p>Thank you for joining us, and we wish you success in your learning journey!</p>
    
            <div class="footer">
                <p>Best regards,<br>Secretariat<br>Makati Business Club</p>
            </div>
        </div>
    </body>
    </html>`;
};

module.exports = WelcomeEmail;
