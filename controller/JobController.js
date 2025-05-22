const jobModel = require('../model/Job');
const pool = require('../config/db');

module.exports = {
  async create(req, res) {
    try {
      const job = await jobModel.create(req.body);
      res.status(201).json(job);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao criar vaga', details: err.message });
    }
  },

  async list(req, res) {
    try {
      const jobs = await jobModel.list();
      res.json(jobs);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao listar vagas' });
    }
  },

  async listWithApplications(req, res) {
    try {
      const hospitalId = req.user.hospital_id;
      if (!hospitalId) {
        return res.status(401).json({ error: 'Hospital não autenticado' });
      }

      const [jobs] = await pool.execute(
        'SELECT * FROM jobs WHERE hospital_id = ?',
        [hospitalId]
      );

      const jobsWithApplications = await Promise.all(
        jobs.map(async (job) => {
          const [applications] = await pool.execute(
            `SELECT a.*, u.name AS user_name, u.email AS user_email
             FROM applications a
             JOIN users u ON a.user_id = u.id
             WHERE a.job_id = ?`,
            [job.job_id]
          );

          return {
            ...job,
            applications
          };
        })
      );

      res.json(jobsWithApplications);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao buscar vagas com aplicações' });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;
      await jobModel.remove(id);
      res.sendStatus(204);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao remover vaga' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      await jobModel.update(id, updateData);
      res.sendStatus(204);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao atualizar vaga' });
    }
  },

  async finishApplication(req, res) {
    try {
      const { applicationId } = req.params;
      const result = await jobModel.finishApplication(applicationId);
      res.status(200).json(result);
    } catch (err) {
      if (err.message === 'Candidatura não encontrada') {
        return res.status(404).json({ error: 'Candidatura não encontrada' });
      }
      if (err.message === 'Trabalho já finalizado') {
        return res.status(400).json({ error: 'Trabalho já foi finalizado' });
      }
      if (err.message === 'Apenas candidaturas aprovadas podem ser finalizadas') {
        return res.status(400).json({ error: 'Candidatura precisa estar aprovada para ser finalizada' });
      }
      res.status(500).json({ error: 'Erro ao finalizar trabalho' });
    }
  }
};
