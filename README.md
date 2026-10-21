# JT Invoice

A simple invoice management application to create PDF invoices, manage customers and products, and track business performance through an analytics dashboard.

## ✨ Features

- **Dashboard & Analytics** — View business statistics, key metrics, and graphical insights through numbers and graphs.
- **Invoice PDF Generator** — Generate PDF invoices efficiently.
- **Customer Management** — Create, view, update, and delete customer records.
- **Product Management** — Create, view, update, and delete product records.
- **Invoice Management** — Create, view, update, and delete invoices.

## 🛠️ Tech Stack

- **Frontend:** React
- **Authentication:** Firebase Authentication
- **Database:** Cloud Firestore

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm or Yarn

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd jt-invoice
   ```

3. Install dependencies.

   **Using npm**

   ```bash
   npm install
   ```

   **Using Yarn**

   ```bash
   yarn install
   ```

4. Start the development server.

   **Using npm**

   ```bash
   npm run dev
   ```

   **Using Yarn**

   ```bash
   yarn dev
   ```

### Firebase Configuration

Configure your Firebase project and add the required Firebase configuration to the application before running it.

Ensure Firebase Authentication and the database service used by the application are enabled in your Firebase project.

## ⚙️ Environment Configuration

Create a `.env` file in the project root and configure the following environment variables:

```dotenv
PORT=3000
PUBLIC_URL=/
REACT_APP_THEME=DEFAULT_LIGHT

REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
REACT_APP_FIREBASE_MEASUREMENT_ID=

REACT_APP_INVOICE_TEMPLATE_COMPANY_NAME=
REACT_APP_INVOICE_TEMPLATE_COMPANY_NAME_SHORT_FORM=
REACT_APP_INVOICE_TEMPLATE_GST=
REACT_APP_INVOICE_TEMPLATE_NAME=
REACT_APP_INVOICE_TEMPLATE_NAME2=
REACT_APP_INVOICE_TEMPLATE_PHONE=
REACT_APP_INVOICE_TEMPLATE_PHONE2=
REACT_APP_INVOICE_TEMPLATE_EMAIL=
REACT_APP_INVOICE_TEMPLATE_BANK_NAME=
REACT_APP_INVOICE_TEMPLATE_BANK_AC_NUMBER=
REACT_APP_INVOICE_TEMPLATE_BANK_IFSC=

REACT_APP_INVOICE_START_YEAR=
```

Replace the empty values with your Firebase project configuration, company details, invoice template information, bank details, and invoice starting year as applicable.
