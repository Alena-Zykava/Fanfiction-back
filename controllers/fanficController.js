const Fanfic = require('../models/Fanfic');

class fanficController {
    async noteFanfic(req, res) {
        // TODO change token
        try {
            const { title, shortDescription, idUser, subtitle, lastDataUpdate } = req.body;

            const fanfic = new Fanfic({ title, shortDescription, idUser, subtitle, lastDataUpdate });
            await fanfic.save();
            return res.json({massage: 'Fanfic notes successfully'})
        } catch (e) {
            console.log(e);
            res.status(400).json({massage: 'Error note'})
        }
    };

    async getFanfic(req, res) {
        try {
            const fanfics = await Fanfic.find();
            return res.json(fanfics);
        } catch (e) {
            console.log(e)
        }
    }

}

module.exports = new fanficController();