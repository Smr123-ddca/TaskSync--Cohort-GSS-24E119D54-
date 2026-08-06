const projectService = require('../services/projectService');
const activityService = require('../services/activityService');

async function createProject(req, res, next) {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'name is required' });
    }

    const project = await projectService.createProject({
      name,
      description,
      ownerId: req.user.id,
    });

    res.status(201).json({ project });
  } catch (err) {
    next(err);
  }
}

async function listProjects(req, res, next) {
  try {
    const projects = await projectService.getProjectsForUser(req.user.id);
    res.json({ projects });
  } catch (err) {
    next(err);
  }
}

async function getProject(req, res, next) {
  try {
    const project = await projectService.getProjectById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ project });
  } catch (err) {
    next(err);
  }
}

async function inviteMember(req, res, next) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'email is required' });
    }

    const invitedUser = await projectService.findUserByEmail(email);

    if (!invitedUser) {
      return res.status(404).json({ error: 'No user found with that email' });
    }

    const membership = await projectService.inviteMember({
      projectId: req.params.id,
      invitedUserId: invitedUser.id,
    });

    if (!membership) {
      return res.status(409).json({ error: 'User is already a member of this project' });
    }

    await activityService.logActivity({
      projectId: req.params.id,
      userId: req.user.id,
      actionType: 'member_invited',
      description: `${req.user.username} invited ${invitedUser.username} to the project`,
    });

    res.status(201).json({ membership });
  } catch (err) {
    next(err);
  }
}

module.exports = { createProject, listProjects, getProject, inviteMember };