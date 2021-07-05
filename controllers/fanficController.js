const Fanfic = require('../models/Fanfic');

class fanficController {
    async addFanfic(req, res) {
        // TODO change token
        try {
            const { title, shortDescription, idUser, subtitle, lastDataUpdate } = req.body;

            const fanfic = new Fanfic({ title, shortDescription, idUser, subtitle, lastDataUpdate });
            await fanfic.save();
            return res.json({message: 'Fanfic notes successfully', idFanfic: fanfic._id})
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Error note'})
        }
    };

    async getFanfics(req, res) {
        try {
            const fanfics = await Fanfic.find();
            return res.json(fanfics);
        } catch (e) {
            console.log(e)
        }
    };
    
    async getFanfic(req, res) {
        try {
            const id = req.params.id;
            const fanfic = await Fanfic.findOne({ _id: id });            
            if (!fanfic) {
                return res.status(403).json({ message: 'Fanfic not found' });
            } 
            return res.json(fanfic);
        } catch (e) {
            console.log(e)
        }
    };

    async getUserFanfics(req, res) {
        try {
            const userId = req.params.userId;            
            const userFanfics = await Fanfic.find({ idUser: userId });
            return res.json(userFanfics);
            
        } catch (e) {
            console.log(e);
            return res.status(403).json({ message: 'Users fanfics not found' });
        }
    }
}

module.exports = new fanficController();