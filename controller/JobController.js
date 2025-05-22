const jobModel = require('../model/Job');

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
