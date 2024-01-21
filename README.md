# Covid Khabar

## Description
A volunteer driven website, with an aim to provide hourly updates for availability of different kind of hospital beds (General, ICU, Ventilator) during Covid in India.

## Technology Stack
- **React** (Frontend)
- **Bootstrap** (CSS)
- **MapBox-GL** (Map)
- **Firebase** (BaaS)
- **Cloud Firestore** (Database)
- **Google Cloud Platform(GCP)** (Hosting & Analytics)

## Features
- display a list of hospitals in a city along with a map having locations pinned on it.
- each hospital displays the following information:
    - no. of beds available
    - no. of patients waiting in queue
    - no. patients admitted in last hour
- login/signup functionality for users via 
    - Google
    - Standard Method
- user/volunteer can add/update information(second bullet point) for individual hospitals
- on successfully providing information for a hospital, a certificate of appreciation is generated for the user.

## Installation
- clone project: $ git clone "https://github.com/abhishekk1098/Covid-Facility.git"
- cd covid-facility
- npm clean install (this will install dependencies from package-lock.json)
- npm start

## Configuration
- To access the Firestore DB, few configurations are required.
- Firstly create an account on Google Firebase.
- Create a new project and initialize a Firestore DB.
- Now, under project setting fetch the app configurations and store them into a `.env` file.
- The KEYS for this .env file can be referred from `services/Firebase.js` file.

## Test
- No tests have been added to this project.