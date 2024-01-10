# Tangential Frontend

This repository contains the Tangential Frontend, a Next.js/React application that can be easily deployed on Vercel. The app features authentication via next-auth with Atlassian, providing easy authentication to your Jira instance.

## Getting Started

To get started with the Tangential Frontend, ensure you have Node.js installed on your machine. Clone this repository and run `yarn install` to install all necessary dependencies.

You will need to install [Tangential Core](https://github.com/akfreas/tangential-core) to do development on this project.

## Deployment

The Tangential Frontend is designed for deployment on Vercel. Follow the standard Vercel deployment process to get your app live.

## Environment Variables

For proper functioning of the app, the following environment variables need to be set on Vercel:

- `NEXT_PUBLIC_DEPLOYMENT_URL`: The URL where your app is deployed.
- `NEXTAUTH_URL`: The full URL of your site as seen by the client (used for authentication callbacks).
- `NEXTAUTH_SECRET`: A secret used to encrypt session data and tokens.
- `ATLASSIAN_CLIENT_ID`: Your Atlassian client ID for OAuth authentication.
- `ATLASSIAN_CLIENT_SECRET`: Your Atlassian client secret for OAuth authentication.
- `MONGODB_URI`: The MongoDB URI for database connectivity.
- `MONGODB_DATABASE`: The MongoDB database to be used.
- `NEXT_PUBLIC_BACKEND_BASE_URL`: The base URL of the backend (e.g., a deployed Next.js backend on Vercel).

Ensure these variables are correctly configured in your Vercel deployment settings.

## Contributing

Contributions are welcome. Please read the contributing guidelines for more information.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
