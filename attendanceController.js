const { attendance, user } = require('../models');
const { Op } = require('sequelize');

module.exports = {
  // POST /api/attendance
  post: async (req, res) => {
    try {
      let { userID, date, time, status } = req.body;
      if (!status) status = 'alpa';

      const newAttendance = await attendance.create({
        userID,
        history: { date, time, status },
        summary: {},
        analysis: {}
      });

      res.json({
        status: 'success',
        message: 'Presensi berhasil dicatat',
        data: {
          attendanceID: newAttendance.attendanceID,
          userID,
          date,
          time,
          status
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: 'error', message: 'Terjadi kesalahan server' });
    }
  },

  // GET /api/attendance/history/:userID
  history: async (req, res) => {
    try {
      const { userID } = req.params;

      const attendances = await attendance.findAll({ where: { userID } });

      const data = attendances.map(a => {
        let history = {};
        try {
          history = typeof a.history === 'string' ? JSON.parse(a.history) : a.history;
        } catch (err) {
          history = {};
        }

        return {
          attendanceID: a.attendanceID,
          userID: a.userID,
          date: history.date || null,
          time: history.time || null,
          status: history.status || 'alpa'
        };
      });

      res.json({ status: 'success', data });

    } catch (err) {
      console.error(err);
      res.status(500).json({ status: 'error', message: 'Terjadi kesalahan server' });
    }
  },

  // GET /api/attendance/summary/:userID
  summary: async (req, res) => {
    try {
      const { userID } = req.params;

      const attendances = await attendance.findAll({ where: { userID } });

      const summaryCounter = { hadir: 0, izin: 0, sakit: 0, alpa: 0 };
      let month = null;

      attendances.forEach(a => {
        let history = {};
        try {
          history = typeof a.history === 'string' ? JSON.parse(a.history) : a.history;
        } catch (err) {
          history = {};
        }

        if (history.date) {
          const d = new Date(history.date);
          const m = String(d.getMonth() + 1).padStart(2, '0');
          const y = d.getFullYear();
          month = `${m}-${y}`;
        }

        const status = history.status || 'alpa';
        if (summaryCounter[status] !== undefined) summaryCounter[status]++;
      });

      res.json({
        status: 'success',
        data: {
          userID: parseInt(userID),
          month,
          attendance_summary: summaryCounter
        }
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ status: 'error', message: 'Terjadi kesalahan server' });
    }
  },

  // POST /api/attendance/analysis
  analysis: async (req, res) => {
    try {
      const { start_date, end_date, group_by } = req.body;

      if (!start_date || !end_date || !group_by) {
        return res.status(400).json({
          status: 'error',
          message: 'start_date, end_date, dan group_by wajib diisi'
        });
      }

      const attendances = await attendance.findAll({
        include: [{ model: user, attributes: ['name', group_by] }],
        where: {
          createdAt: {
            [Op.between]: [new Date(start_date), new Date(end_date)]
          }
        }
      });

      const grouped = {};
      attendances.forEach(a => {
        let history = {};
        try {
          history = typeof a.history === 'string' ? JSON.parse(a.history) : a.history;
        } catch (err) {
          history = {};
        }

        const group = a.user ? a.user[group_by] || 'Undefined' : 'Undefined';
        if (!grouped[group]) {
          grouped[group] = {
            total_users_set: new Set(),
            total_attendance: { hadir: 0, izin: 0, sakit: 0, alpa: 0 }
          };
        }

        grouped[group].total_users_set.add(a.userID);

        const status = history.status || 'alpa';
        if (grouped[group].total_attendance[status] !== undefined) {
          grouped[group].total_attendance[status]++;
        }
      });

      const grouped_analysis = Object.keys(grouped).map(group => {
        const totalUsers = grouped[group].total_users_set.size;
        const totals = grouped[group].total_attendance;
        const totalAttendances = totals.hadir + totals.izin + totals.sakit + totals.alpa;

        const attendance_rate = {
          hadir_percentage: totalAttendances ? (totals.hadir / totalAttendances * 100).toFixed(2) : 0,
          izin_percentage: totalAttendances ? (totals.izin / totalAttendances * 100).toFixed(2) : 0,
          sakit_percentage: totalAttendances ? (totals.sakit / totalAttendances * 100).toFixed(2) : 0,
          alpa_percentage: totalAttendances ? (totals.alpa / totalAttendances * 100).toFixed(2) : 0,
        };

        return {
          group,
          total_users: totalUsers,
          attendance_rate,
          total_attendance: totals
        };
      });

      res.json({
        status: 'success',
        data: {
          analysis_period: { start_date, end_date },
          grouped_analysis
        }
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ status: 'error', message: 'Terjadi kesalahan server' });
    }
  }
};
