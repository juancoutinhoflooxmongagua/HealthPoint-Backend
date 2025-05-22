const pool = require('../config/db');

module.exports = {
  async create(data) {
    const { creator_id, hospital_name, hospital_id, job_type, job_title, job_description, job_points } = data;
    const [result] = await pool.execute(
      `INSERT INTO jobs 
      (creator_id, hospital_name, hospital_id, job_type, job_title, job_description, job_points)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [creator_id, hospital_name, hospital_id, job_type, job_title, job_description, job_points]
    );
    return { job_id: result.insertId, ...data };
  },

  async list() {
    const [results] = await pool.execute('SELECT * FROM jobs');
    return results;
  },

  async remove(id) {
    await pool.execute('DELETE FROM jobs WHERE job_id = ?', [id]);
  },

  async update(id, data) {
    const { hospital_name, hospital_id, job_type, job_title, job_description, job_points } = data;
    await pool.execute(
      `UPDATE jobs SET 
        hospital_name = ?, 
        hospital_id = ?, 
        job_type = ?, 
        job_title = ?, 
        job_description = ?, 
        job_points = ?
      WHERE job_id = ?`,
      [hospital_name, hospital_id, job_type, job_title, job_description, job_points, id]
    );
  },

  async finishApplication(applicationId) {
    const [result] = await pool.execute(
      `SELECT a.application_status, j.job_points, a.user_id
       FROM applications a
       INNER JOIN jobs j ON a.job_id = j.job_id
       WHERE a.application_id = ?`,
      [applicationId]
    );

    if (result.length === 0) {
      throw new Error('Candidatura não encontrada');
    }

    const { application_status, job_points, user_id } = result[0];

    if (application_status === 'finished') {
      throw new Error('Trabalho já finalizado');
    }

    if (application_status !== 'approved') {
      throw new Error('Apenas candidaturas aprovadas podem ser finalizadas');
    }

    await pool.execute(
      `UPDATE applications
       SET application_status = 'finished',
           points_awarded = ?,
           decision_at = NOW()
       WHERE application_id = ?`,
      [job_points, applicationId]
    );

    return {
      message: 'Trabalho finalizado com sucesso',
      points_awarded: job_points,
      user_id
    };
  }
};
