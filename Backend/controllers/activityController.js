const activityService = require('../services/activityService');

async function getActivity(req, res, next) {
  try {
    const activity = await activityService.getRecentActivity(req.params.id);
    res.json({ activity });
  } catch (err) {
    next(err);
  }
}

module.exports = { getActivity };