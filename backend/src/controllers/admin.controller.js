import * as adminService from "../services/admin.service.js";

export async function getDashboard(req, res) {
    try {
        const dashboard = await adminService.getDashboardStats();

        res.status(200).json({
            success: true,
            data: dashboard
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}