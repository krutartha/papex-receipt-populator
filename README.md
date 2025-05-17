# PapeX Receipt Populator

A simple receipt generator system for the PapeX App built with Next.js, TypeScript, Firebase, and Tailwind CSS. This application allows admins to create and store receipts with multiple line items, automatic total calculations, and secure user authentication. This project is for demo and marketing purposes only!

## Features

- 🔐 Secure user authentication with Firebase
- 📝 Create detailed receipts with multiple line items
- 💰 Automatic total calculation
- 🌐 Multi-currency support
- 🏪 Merchant management
- 🔄 Real-time data synchronization with Firebase
- 📱 Responsive design with Tailwind CSS

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)
- Git

## Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/papex-receipt-populator.git
cd papex-receipt-populator
```

2. Install dependencies:
```bash
npm install
```


4. Create a `.env.local` file in the project root with your Firebase configuration:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

## Usage Guide

### Authentication

1. Create an account or sign in using your email and password
2. The system will automatically redirect you to the receipt creation page after successful authentication

### Creating Receipts

1. Enter the merchant name
2. Select the currency (USD, EUR, or GBP)
3. Add line items:
   - Enter item name
   - Enter item price
   - Click "Add Line Item" for additional items
4. The total amount is automatically calculated
5. Click "Create Receipt" to save

### Security Features

- Protected routes require authentication
- Secure data storage in Firebase
- User-specific receipt access
- Automatic session management

## Project Structure

```
papex-receipt-populator/
├── components/          # React components
├── contexts/           # Context providers
├── lib/               # Firebase and utility functions
├── pages/             # Next.js pages
├── styles/            # Global styles and Tailwind config
├── public/            # Static assets
└── package.json       # Project dependencies
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Technology Stack

- **Frontend Framework**: Next.js with TypeScript
- **Styling**: Tailwind CSS
- **Form Management**: React Hook Form
- **Backend/Database**: Firebase (Authentication & Firestore)
- **Development Tools**: ESLint, PostCSS

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
