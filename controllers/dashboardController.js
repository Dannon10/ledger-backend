import Invoice from '../models/Invoice.js';
import Project from '../models/Projects.js';

export const getDashboardSummary = async (req, res) => {
    try {
        const totalOwed = await Invoice.aggregate([
            { $match: { status: { $in: ['sent', 'overdue'] } } },
            { $group: { _id: null, total: { $sum: '$total' } } },
        ]);

        const overdueCount = await Invoice.countDocuments({ status: 'overdue' });

        const activeProjectsCount = await Project.countDocuments({ status: 'active' });

        res.status(200).json({
            totalOwed: totalOwed[0]?.total || 0,
            overdueCount,
            activeProjectsCount,
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};