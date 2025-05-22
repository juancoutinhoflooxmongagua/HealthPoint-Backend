const pool = require('../config/db');

module.exports = {
  // Criar um job
  async create(data) {
    const { creator_id, hospital_name, hospital_id, job_type, job_title, job_description, job_points } = data;

    console.log('Dados recebidos para criação:', data);
    try {
      const [result] = await pool.execute(
        `INSERT INTO jobs 
        (creator_id, hospital_name, hospital_id, job_type, job_title, job_description, job_points)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [creator_id, hospital_name, hospital_id, job_type, job_title, job_description, job_points]
      );
      return { job_id: result.insertId, ...data };
    } catch (err) {
      console.error('Erro no INSERT do job:', err);
      throw err;
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
  },

  // Finalizar um job
  async finish(id) {
    try {
      const [result] = await pool.execute(
        'SELECT job_points FROM jobs WHERE job_id = ?',
        [id]
      );

      if (result.length === 0) {
        throw new Error('Job não encontrado');
      }

      const jobPoints = result[0].job_points;

      await pool.execute(
        'UPDATE jobs SET job_status = "finished" WHERE job_id = ?',
        [id]
      );

      await pool.execute(
        `UPDATE applications 
         SET application_status = 'completed', 
             points_awarded = ?, 
             decision_at = NOW() 
         WHERE job_id = ? AND application_status = 'approved'`,
        [jobPoints, id]
      );

      return { message: 'Job finalizado com sucesso', jobPoints };
    } catch (err) {
      console.error('Erro ao finalizar job:', err);
      throw err;
    }
  }
};
