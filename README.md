# Family Task Manager

## Description
This is a mobile-first web application that allows family members to create, view, and manage tasks together. It is built using React, Supabase, and Tailwind CSS. The app connects to a Supabase backend for managing user accounts, tasks, and family data.

## Features:
- Create, update, and delete tasks.
- Tasks can be assigned priorities and display creation dates.
- Tasks can be marked as pending, in progress, or completed.
- Users can view suggested tasks and add them to their to-do list.

---

## Setup Instructions

### 1. Clone the Repository
Input the following into bash:
```
git clone <your-repo-url>
cd family-task-manage
```

### 2. Install Dependencies
Make sure you have Node.js installed. Then, run the following command:
npm install

### 3. Set up Supabase
To connect your application to Supabase, you will need to:

- Create an account at Supabase and start a new project.
- Get your Supabase credentials (API URL and Key) from the project settings.
- Set up the required database tables by executing the following SQL commands in Supabase.

Here is the code to get started: 
```
-- Create the families table
CREATE TABLE families (
  id SERIAL PRIMARY KEY,
  surname TEXT NOT NULL
);

-- Create the users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  family_id INTEGER REFERENCES families(id),
  name TEXT NOT NULL,
  role TEXT
);

-- Create the tasks table
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  family_id INTEGER REFERENCES families(id),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT,
  priority INTEGER DEFAULT 1, -- Priority from 1 (Low) to 3 (High)
  date_created TIMESTAMP DEFAULT NOW()
);

-- Create the suggested_tasks table
CREATE TABLE suggested_tasks (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT,
  estimated_cost NUMERIC
);

-- Insert initial data into suggested_tasks
INSERT INTO suggested_tasks (name, description, status, estimated_cost) VALUES 
('Schedule annual health check-ups', 'Coordinate and schedule annual health check-ups for the family.', 'Pending', 100),
('Weekly grocery shopping', 'Create a comprehensive shopping list for the week and purchase essentials.', 'Pending', 50);

-- Insert sample family and user data
INSERT INTO families (surname) VALUES ('Doe');

INSERT INTO users (family_id, name, role) VALUES 
(1, 'John Doe', 'parent');

-- Insert sample tasks
INSERT INTO tasks (family_id, name, description, status, priority) VALUES 
(1, 'Fix the kitchen sink', 'The sink has a leak that needs to be fixed.', 'Pending', 2),
(1, 'Grocery shopping', 'Buy groceries for the week.', 'Pending', 1),
(1, 'Mow the lawn', 'Mow the front and back lawns.', 'In progress', 3);
```

### 4. Set Up the .env File
Create a .env file at the root of your project with the following content, replacing the placeholder values with your Supabase project credentials:

```
REACT_APP_SUPABASE_URL=https://<your-supabase-url>.supabase.co
REACT_APP_SUPABASE_KEY=<your-supabase-api-key>
```

### 5. Running the Project Locally
Once you have the .env file configured and the Supabase tables set up, you can run the project locally using the following command:

```
npm start
```

This will start the development server. By default, the app should be available at http://localhost:3000.

---

Thank you for reading!