const Fanfic = require('../models/Fanfic');

class fanficController {
    async addFanfic(req, res) {
        // TODO token
        try {
            const { title, shortDescription, userName, subtitle, image } = req.body;

            const lastDataUpdate = new Date().toLocaleDateString();

            const fanfic = new Fanfic({ title, shortDescription, userName, subtitle, lastDataUpdate, image });
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
            const userName = req.params.userId;            
            const userFanfics = await Fanfic.find({ userName });
            return res.json(userFanfics);
            
        } catch (e) {
            console.log(e);
            return res.status(403).json({ message: 'Users fanfics not found' });
        }
    }

    async deleteFanfic(req, res) {
        try {
            const { id } = req.params;
            console.log("body",req.params);
            const fanfic = await Fanfic.findOne({ _id: id });
            
            if (!fanfic) {
                res.status(400).json({message: 'Not found fanfic'})
            }
            await fanfic.deleteOne();
            return res.json({ message: "Fanfic delete" });
            
        } catch (e) {
            res.status(400).json({message: 'Error delete fanfic'})
        }
    }

    async updateFanfic(req, res) {
        try {
            const { title, shortDescription, userName, subtitle, id, image } = req.body;            

            const lastDataUpdate = new Date().toLocaleDateString();

            await Fanfic.updateOne(
                { _id: id },
                { $set: {title, shortDescription, userName, subtitle, lastDataUpdate, image}}
            )
            return res.json({message: 'Fanfic update', idFanfic: id })
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Error update fanfic'})
        }
    }
}

module.exports = new fanficController();