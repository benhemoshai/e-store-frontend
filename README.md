# Animal Arts E-Store Frontend 🐾🖼️

**Animal Arts** is an Angular-based e-commerce frontend for a pet-themed art store. This project provides a responsive and user-friendly interface where customers can browse products, manage their carts, and place orders. The frontend integrates seamlessly with the backend to deliver a smooth shopping experience.

## Overview

The **Animal Arts E-Store Frontend** is designed to create an engaging and intuitive shopping experience. It communicates with the backend API for product data, user authentication, and order management, ensuring real-time updates and secure data interactions.

## Features

- **Responsive UI**: The interface adapts to different screen sizes, providing an optimal experience on desktops, tablets, and mobile devices.
- **User Authentication**: Allows users to register, log in, and securely access their accounts.
- **Product Management**: Displays a catalog of products, detailed product views, and search functionality.
- **Personal Cart**: Users can add, update, and remove items from their cart, with changes reflected in real-time.
- **Product Reviews**: Users can leave reviews on products, adding a personalized touch to the shopping experience.

## Technologies Used

- **Angular**
- **Angular Material** for UI components
- **Bootstrap** for responsive design
- **RxJS** for reactive programming
- **HTML5** and **CSS3**

## Pages and Components

- **Home Page**: A landing page that showcases featured products and categories.
- **Product Page**: Detailed product information, including images, descriptions, and reviews.
- **Cart Page**: Displays user-selected items with options to modify quantities or remove items.
- **Checkout Page**: Allows users to confirm orders and proceed to payment.
- **Authentication Pages**: Login and registration forms for secure access.

## Getting Started

To run the project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/benhemoshai/e-store-frontend.git
   ```

2. Navigate to the project directory:

   ```bash
   cd e-store-frontend
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   ng serve
   ```

   The application will be available at `http://localhost:4200`.

## Project Structure

```bash
animal-arts-frontend/
│
├── src/
│   ├── app/
│   │   ├── components/            # Reusable components
│   │   ├── services/              # Services for API calls
│   │   ├── models/                # Interfaces and data models
│   │   ├── pages/                 # Main application pages
│   │   ├── app.module.ts          # Main Angular module
│   │   └── app.component.ts       # Root component
│   ├── assets/                    # Static assets (images, icons)
│   ├── environments/              # Environment-specific configurations
│   ├── index.html                 # Main HTML file
│   └── styles.css                 # Global styles
│
└── angular.json                   # Angular project configuration
```

## Key Learnings

1. **Frontend-Backend Integration**: Established secure communication with the backend API, managing product data, user sessions, and cart functionality.
2. **Responsive Design**: Ensured a consistent user experience across devices with Angular Material and Bootstrap.
3. **State Management**: Used **RxJS** to manage state and handle asynchronous data, providing a smooth and responsive UI.

## Deployment

The frontend is deployed on **Vercel**, where it integrates with the backend for a complete, live e-commerce experience.

---

Check out the live app here: [Animal Arts E-Store](https://e-store-animalarts.vercel.app/)

#Angular #Ecommerce #WebDevelopment #ResponsiveDesign #AngularMaterial #RxJS #FrontendDevelopment
