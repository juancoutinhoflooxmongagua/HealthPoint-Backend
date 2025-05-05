const pool = require('../config/db'); // Importando a pool de conexões

module.exports = {
  // Criar um novo job
  async create(data) {
    const { creator_id, hospital_name, hospital_id, job_type, job_title, job_description, job_points } = data;

    try {
      const [result] = await pool.execute(
        `INSERT INTO jobs 
        (creator_id, hospital_name, hospital_id, job_type, job_title, job_description, job_points)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [creator_id, hospital_name, hospital_id, job_type, job_title, job_description, job_points]
      );
      return { job_id: result.insertId, ...data };
    } catch (err) {
      throw new Error('Erro ao criar vaga');
    }
  },

  // Listar todos os jobs
  async list() {
    try {
      const [results] = await pool.execute('SELECT * FROM jobs');
      return results;
    } catch (err) {
      throw new Error('Erro ao listar vagas');
    }
  },

  // Remover um job
  async remove(id) {
    try {
      await pool.execute('DELETE FROM jobs WHERE job_id = ?', [id]);
    } catch (err) {
      throw new Error('Erro ao remover vaga');
    }
  },

  // Atualizar um job
  async update(id, data) {
    const { hospital_name, hospital_id, job_type, job_title, job_description, job_points } = data;

    try {
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
    } catch (err) {
      throw new Error('Erro ao atualizar vaga');
    }
  }
};
