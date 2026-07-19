# Feedback Companion - Interactive Feedback Form
<p align="center">
  <strong>🔗 <a href="https://interactive-feedback-form-omega.vercel.app/" target="_blank">View Live Demo</a></strong>
</p>
A conversational feedback form that transforms the traditional form-filling experience into a natural, engaging dialogue. Built with vanilla HTML, CSS, and JavaScript, this project demonstrates connecting a frontend interface to a REST API.

## Overview

This project is a web-based feedback collection tool that feels more like chatting with an assistant than filling out a form. Users are guided through a step-by-step conversation where they provide their name, email, category, rating, and a detailed reflection. The interface adapts to user input with dynamic color changes, visual feedback, and achievement rewards.

## Features

### Core Functionality
- Conversational step-by-step form flow
- Five input fields: name, email, category, rating, message
- Client-side validation with inline error messages
- No page reload on submission


### Bonus Features
- Fetches and displays 5 most recent submissions
- Character counter with circular progress ring
- Fully responsive design for mobile, tablet, and desktop
- Dynamic color themes based on user rating

### Technical Highlights
- Plain HTML, CSS, and JavaScript (no frameworks)
- Fetch API for HTTP requests
- Async/await for handling promises
- LocalStorage for draft saving
- CSS Custom Properties for theming
- CSS animations and transitions
- Semantic HTML with ARIA attributes

## Screenshots

### Desktop View - Form Interface
<img width="1052" height="797" alt="image" src="https://github.com/user-attachments/assets/ef361726-489d-4e64-9809-c7ccd83e453d" />


### Mobile View - Responsive Design
<img width="352" height="755" alt="image" src="https://github.com/user-attachments/assets/432f0134-4b9c-4fe0-870f-546f0d80f1a5" />

### Success State with Achievements
<img width="972" height="790" alt="image" src="https://github.com/user-attachments/assets/01e4aae6-3ab3-478a-9bdf-10c271b13b69" />


### Recent Feedback Section
<img width="872" height="418" alt="image" src="https://github.com/user-attachments/assets/af6b5846-a1b8-42c4-b5b1-11ebea0059e1" />


## How to Run

1. Clone this repository to your local machine
2. Open the project folder
3. Open index.html in your preferred browser
4. No additional setup required - the form works immediately

You can also use Live Server in VS Code for a better development experience.

## API Used

This project uses JSONPlaceholder as a mock API. It was chosen because:

- Zero setup required - works immediately
- Returns realistic responses with IDs
- Simulates both success and error scenarios
- Perfect for learning API integration without needing a backend

The form sends a POST request to https://jsonplaceholder.typicode.com/posts with the user's feedback data and receives a simulated response with an ID. It also fetches the latest 5 posts for the recent reflections section.

## Technologies Used

- HTML5
- CSS3 (with Custom Properties)
- JavaScript (ES6+)
- Fetch API
- Google Fonts (Inter, Playfair Display)
- LocalStorage API

## What I Learned

Building this project taught me how to connect a frontend interface to a REST API using the Fetch API. I learned to handle asynchronous operations with async/await and manage different UI states like loading, success, and error.

The most challenging aspect was creating a seamless conversational experience that feels natural and engaging. I had to carefully design the flow, animations, and feedback mechanisms to make the form feel like a real conversation rather than a data entry process.

I also gained experience with responsive design and ensuring the form works well on all screen sizes. The character counter with circular progress was an interesting challenge that taught me about SVG animations and state management.

## Challenges Faced

Managing the conversational state while keeping the code clean and maintainable was initially difficult. I solved this by structuring the conversation flow as a series of steps with clear state transitions.

Creating the dynamic theme changes based on user rating required careful coordination between CSS variables and JavaScript. The confetti animation was also challenging to implement without external libraries.

Ensuring accessibility while maintaining an engaging visual design required balancing aesthetics with semantic HTML and proper ARIA attributes.

## Future Improvements

- Connect to a real backend API for persistent data storage
- Add user authentication
- Implement email notifications for feedback responses
- Add more achievement types and gamification elements
- Create an admin dashboard for viewing all feedback
- Add export functionality for feedback data

## Project Structure
feedback-form/
├── index.html # Main HTML file
├── style.css # Complete styles with dark blue theme
├── script.js # All JavaScript functionality
├── README.md # Project documentation


## Credits

- JSONPlaceholder for providing the mock API
- Google Fonts for typography
- Built as part of the Web Development Track

## License

This project is created for educational purposes as part of a web development assignment.
