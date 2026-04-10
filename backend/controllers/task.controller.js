import { User } from '../models/User.model.js';
import { Task } from '../models/Task.model.js';

export const createTask = async (req, res) => {
  try {
    console.log('==== CREATE TASK API HIT ====');
    console.log('Request Body:', req.body);
    console.log('Logged in User:', req.user?._id);
    const { title, description, dueDate, assignedTo } = req.body;

    if (!title || title.trim() === '') {
      console.log('ERROR: Title missing');
      return res.status(400).json({ message: 'Title is required' });
    }

    let taskType = 'personal';
    let assignedUser = null;

    console.log('assignedTo value:', assignedTo);

    // If task is assigned
    if (assignedTo && assignedTo.trim() !== '') {
      // check if user exists
      const assigneeExists = await User.findOne({
        $or: [{ email: assignedTo }, { name: assignedTo }],
      });
      console.log('Assignee Found:', assigneeExists);

      if (!assigneeExists) {
        console.log('ERROR: Assignee not found in DB');
        return res.status(404).json({ message: 'Assignee Not Found' });
      }

      if (assigneeExists._id.toString() === req.user._id.toString()) {
        console.log('ERROR: User trying to assign task to himself');

        return res
          .status(400)
          .json({ message: 'You cannot assign task to yourself' });
      }

      console.log('Checking assignee in DB...');

      taskType = 'assigned';
      assignedUser = assigneeExists._id;
    }

    console.log('Creating Task in DB...');

    const task = await Task.create({
      title,
      description,
      assignedTo: assignedUser,
      createdBy: req.user._id,
      taskType,
      dueDate,
    });

    console.log('Task Created Successfully:', task);

    res.status(201).json(task);
  } catch (error) {
    console.log('Create Task Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [{ createdBy: req.user._id }, { assignedTo: req.user._id }],
    })
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task Not Found' });
    }

    const isCreator = task.createdBy.toString() === req.user._id.toString();
    const isAssignee = task.assignedTo?.toString() === req.user._id.toString();

    if (!isCreator && !isAssignee) {
      return res.status(403).json({ message: 'Not Allowed' });
    }

    // PERSONAL TASK: creator can update everything
    if (task.taskType === 'personal') {
      if (!isCreator) {
        return res
          .status(403)
          .json({ message: ' Only Creator Can Edit Personal Task' });
      }

      task.title = req.body.title || task.title;
      task.description = req.body.description || task.description;
      task.status = req.body.status || task.status;
      task.dueDate = req.body.dueDate || task.dueDate;

      await task.save();
      return res.status(200).json(task);
    }

    // ASSIGNED TASK
    if (task.taskType === 'assigned') {
      // Assignee: Can only status update

      if (isAssignee && !isCreator) {
        // Block if they try to change anything other than status
        if (req.body.title || req.body.description || req.body.dueDate) {
          return res.status(403).json({
            message: 'Assignee Can Only Update Status',
          });
        }

        if (!req.body.status) {
          return res.status(400).json({ message: 'No valid fields to update' });
        }

        task.status = req.body.status;
        await task.save();
        return res.status(200).json(task);
      }

      // CREATOR (assigner): can only update dueDate
      if (isCreator) {
        // Block title/description change/status change
        if (req.body.status || req.body.title || req.body.description) {
          return res.status(403).json({
            message: 'Assigner Cannot Change Status, Title or Description',
          });
        }

        if (!req.body.dueDate) {
          return res.status(400).json({ message: 'No valid fields to update' });
        }

        task.dueDate = req.body.dueDate;
        await task.save();
        return res.status(200).json(task);
      }
    }
    res.status(400).json({ message: 'Invalid update request' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//delet task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task Not Found ' });
    }

    const isCreator = task.createdBy.toString() === req.user._id.toString();
    if (!isCreator) {
      return res.status(403).json({
        message: 'Only Original Creator Can Allow To Delete The Task',
      });
    }
    await task.deleteOne();
    res.status(200).json({ message: 'Task Deleted Successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
