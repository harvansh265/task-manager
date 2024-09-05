const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const Task = require('../models/Task');

// Add a new task
exports.addTask = async (req, res) => {
    try {

        console.log('addTask' , req.body);


        const { title, description, status } = req.body;

        if(!title || title == "") return res.status(400).json({status: false, message: 'Title is required' });
        if(!description || description == "") return res.status(400).json({status: false, message: 'Description is required' });
        if(!status || status == "") return res.status(400).json({status: false, message: 'Status is required' });

        const result = await Task.insertMany({
            title,
            description,
            status,
            createdAt: new Date(),
            updatedAt: new Date(),
            user: new ObjectId(req.userId),
        });

        res.status(200).json({status: true ,  message: 'Task created successfully'});
    } catch (error) {
        console.log('Error on addtask' , error)
        res.status(200).json({status: false ,  error: 'Error creating task' });
    }
}

// Get all tasks for the logged-in user
exports.allTask = async (req, res) => {
    try {

        const { status } = req.query;
        const filter = { user: new ObjectId(req.userId) };

        if(status && status != ""){
            filter.status = status;
        }

        const tasks = await Task.find(filter).sort({
            createdAt: -1,
          });
        res.json({status: true ,  message : tasks });
    } catch (error) {
        console.log('Error on alltask' , error)
        res.status(200).json({status: false ,  error: 'Error retrieving tasks' });
    }
}


// Update a task
exports.updateTask = async (req, res) => {
    try {
        const { title, description, status } = req.body;
        const result = await Task.updateOne(
            { _id: new ObjectId(req.params.id), user: new ObjectId(req.userId) },
            {
                $set: {
                    title,
                    description,
                    status,
                    updatedAt: new Date(),
                }, 
            }
        );

        if (result.matchedCount === 0) return res.status(400).json({status: false ,  error: 'Task not found' });

        res.json({status: true ,  message: 'Task updated successfully' });
    } catch (error) {
        console.log('Error on updatetask' , error)
        res.status(200).json({status: true ,  error: 'Error updating task' });
    }
}

// Delete a task
exports.deleteTask = async (req, res) => {
    try {
        const result = await Task.deleteOne({
            _id: new ObjectId(req.params.id),
            user: new ObjectId(req.userId),
        });

        if (result.deletedCount === 0) return res.status(400).json({status: false ,  error: 'Task not found' });

        res.json({status: true ,  message: 'Task deleted successfully' });
    } catch (error) {
        console.log('Error on deletetask' , error)
        res.status(200).json({status: false ,  error: 'Error deleting task' });
    }
}