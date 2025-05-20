const jobModel = require('../model/Job');

module.exports = {
  async create(req, res) {
    try {
      console.log('[CREATE JOB] Dados recebidos:', req.body);

      const job = await jobModel.create(req.body);

      console.log('[CREATE JOB] Vaga criada com sucesso:', job);
      res.status(201).json(job);
    } catch (err) {
      console.error('[CREATE JOB] Erro ao criar vaga:', {
        mensagem: err.message,
        stack: err.stack,
        dadosRecebidos: req.body
      });
      res.status(500).json({
        error: 'Erro ao criar vaga',
        details: err.message
      });
    }
  },

  async list(req, res) {
    try {
      console.log('[LIST JOBS] Iniciando listagem de vagas...');

      const jobs = await jobModel.list();

      console.log(`[LIST JOBS] ${jobs.length} vagas encontradas`);
      res.json(jobs);
    } catch (err) {
      console.error('[LIST JOBS] Erro ao listar vagas:', {
        mensagem: err.message,
        stack: err.stack
      });
      res.status(500).json({ error: 'Erro ao listar vagas' });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;
      console.log(`[REMOVE JOB] Tentando remover vaga com ID: ${id}`);

      await jobModel.remove(id);

      console.log('[REMOVE JOB] Vaga removida com sucesso');
      res.sendStatus(204);
    } catch (err) {
      console.error('[REMOVE JOB] Erro ao remover vaga:', {
        mensagem: err.message,
        stack: err.stack,
        id: req.params.id
      });
      res.status(500).json({ error: 'Erro ao remover vaga' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      console.log(`[UPDATE JOB] Tentando atualizar vaga com ID: ${id}`);
      console.log('[UPDATE JOB] Dados recebidos para atualização:', updateData);

      await jobModel.update(id, updateData);

      console.log('[UPDATE JOB] Vaga atualizada com sucesso');
      res.sendStatus(204);
    } catch (err) {
      console.error('[UPDATE JOB] Erro ao atualizar vaga:', {
        mensagem: err.message,
        stack: err.stack,
        id: req.params.id,
        dadosRecebidos: req.body
      });
      res.status(500).json({ error: 'Erro ao atualizar vaga' });
    }
  }
};
