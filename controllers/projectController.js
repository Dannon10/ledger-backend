import Project from '../models/Projects.js'

export const createProject = async (req, res) => {
    try {
        const { title, description, status, deadline, client } = req.body;

        if (!title || !client) {
            return res.status(400).json({ message: 'Project title and client are required' });
        }

        const project = await Project.create({
            title,
            description,
            status,
            deadline,
            client,
            createdBy: req.user.id
        });
        res.status(201).json(project);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

export const getProjects = async (req, res) => {
    try {
        const projects = await Project.find().populate('client').sort({ createdAt: -1 });

        if (!projects) {
            return res.status(404).json({ message: 'No projects found' });
        }

        res.status(200).json(projects);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

export const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('client', 'name company email');

        if (!project) {
            res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json(project);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const updateProject = async (req, res) => {
    try {
        const { title, description, status, deadline, client } = req.body;

        const project = await Project.findByIdAndUpdate(
            req.params.id,
            { title, description, status, deadline, client },
            { new: true, runValidators: true }
        );

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json(project);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};