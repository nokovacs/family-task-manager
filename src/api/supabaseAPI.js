import { supabase } from '../supabaseClient';

// Add a new task by fetching the family_id using the user_id first
export const addTask = async (userId, taskName, taskDescription, taskPriority = 'low') => {
  try {
    // Fetch the family_id using the user_id
    const familyId = await getFamilyIdByUserId(userId);

    // Insert a new task for the corresponding family_id with priority
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ 
        family_id: familyId, 
        name: taskName, 
        description: taskDescription, 
        status: 'Pending', 
        priority: taskPriority, // Add the priority field
        date_created: new Date().toISOString() // Add date_created field
      }]);

    if (error) {
      throw error;
    }
    return data;

  } catch (err) {
    console.error('Error adding task:', err);
    throw err;
  }
};

// Add a task to the tasks (to-do) table by fetching family_id based on userId
export const addTaskToToDo = async (task, userId) => {
  try {
    // Fetch the family_id based on userId
    const familyId = await getFamilyIdByUserId(userId);

    // Now insert the task into the tasks table
    const { data, error } = await supabase
      .from('tasks')
      .insert([
        {
          family_id: familyId,
          name: task.name,
          description: task.description,
          status: 'Pending', // Default status as pending for a new to-do task
        },
      ]);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error adding task to to-do list:', error);
    throw error;
  }
};

// Delete a task by task ID
export const deleteTask = async (taskId) => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);

  if (error) {
    throw error;
  }
};

// Fetch a task by task ID
export const fetchTask = async (taskId) => {
  try {
    // Query the tasks table by the task ID
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single(); // Ensure we're fetching only a single record

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching task by ID:', error);
    throw error;
  }
};

// Fetch suggested tasks
export const fetchSuggestedTasks = async () => {
  const { data, error } = await supabase
    .from('suggested_tasks')
    .select('*');

  if (error) {
    throw error;
  }
  return data;
};

// Fetch tasks with priority and date_created
export const fetchTasks = async (userId, status) => {
  const familyId = await getFamilyIdByUserId(userId);

  const { data, error } = await supabase
    .from('tasks')
    .select('id, name, description, status, priority, date_created')
    .eq('family_id', familyId)
    .eq('status', status);

  if (error) {
    throw error;
  }
  return data;
};

// Fetch the family_id based on user_id
const getFamilyIdByUserId = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .select('family_id')
    .eq('id', userId)
    .single(); // Fetches a single user

  if (error) {
    throw error;
  }

  return data.family_id;
};

// Fetch the user based on user_id
export const getUserByUserId = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single(); // Fetches a single user

  if (error) {
    throw error;
  }

  return data;
};

// Update task priority
export const updateTaskPriority = async (taskId, priority) => {
  const { data, error } = await supabase
    .from('tasks')
    .update({ priority })
    .eq('id', taskId);

  if (error) {
    throw error;
  }
  return data;
};

// Update task status
export const updateTaskStatus = async (taskId, status) => {
  const { data, error } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', taskId);  // Update a specific task based on its ID

  if (error) {
    throw error;
  }
  return data;
};
