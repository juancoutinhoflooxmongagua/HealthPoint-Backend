const db = require('../config/db');

module.exports = {
  create(data) {
    const {
      creator_id,
      hospital_name,
      hospital_id,
      job_type,
      job_title,
      job_description,
      job_points
    } = data;

    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO jobs 
        (creator_id, hospital_name, hospital_id, job_type, job_title, job_description, job_points)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [creator_id, hospital_name, hospital_id, job_type, job_title, job_description, job_points],
        (err, result) => {
          if (err) return reject(err);
          resolve({ job_id: result.insertId, ...data });
        }
      );
    });
  },

  list() {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM jobs', (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  remove(id) {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM jobs WHERE job_id = ?', [id], (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  },

  update(id, data) {
    const {
      hospital_name,
      hospital_id,
      job_type,
      job_title,
      job_description,
      job_points
    } = data;

    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE jobs SET 
          hospital_name = ?, 
          hospital_id = ?, 
          job_type = ?, 
          job_title = ?, 
          job_description = ?, 
          job_points = ?
        WHERE job_id = ?`,
        [hospital_name, hospital_id, job_type, job_title, job_description, job_points, id],
        (err) => {
          if (err) return reject(err);
          resolve();
        }
      );
    });
  }
};
