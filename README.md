# records-dashboard
# Project run instructions

To run the project locally, install dependencies and start both the frontend and the mock backend.

Install dependencies:
npm install

Start the frontend (Next.js):
npm run dev
The application will be available at http://localhost:3000

Start the mock backend (json-server):
json-server --watch db.json --port 3004
The mock API will be available at http://localhost:3004

For local development, make sure both commands are running at the same time.

## Important Note
If you delete the test user, you'll need to either:
- Revert changes in `db.json` to the original state, or
- Replace `db.json` with the original version

This is necessary to be able to log in with the default admin user again.