const jobModel = require('../model/Job');

module.exports = {
  async create(req, res) {
    try {
      console.log(' Dados recebidos:', req.body);

      const job = await jobModel.create(req.body);
      res.status(201).json(job);
    } catch (err) {
      console.error('Erro ao criar vaga:', err);
      res.status(500).json({
        error: 'Erro ao criar vaga',
        details: err.message
      });
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

  async remove(req, res) {
    try {
      await jobModel.remove(req.params.id);
      res.sendStatus(204);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao remover vaga' });
    }
  },

  async update(req, res) {
    try {
      await jobModel.update(req.params.id, req.body);
      res.sendStatus(204);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao atualizar vaga' });
    }
  }
};
