const { Company } = require('../models/models');  

exports.createCompany = async (req, res) => {
    const { name, address, website } = req.body;

    try {
        const company = new Company({
            name,
            address,
            website,
        });

        await company.save();
        res.status(201).json(company);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.find();
        res.json(companies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCompanyById = async (req, res) => {
    const { id } = req.params;

    try {
        const company = await Company.findById(id);

        if (!company) {
            return res.status(404).json({ error: 'Company not found' });
        }

        res.json(company);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateCompany = async (req, res) => {
    const { id } = req.params;
    const { name, address, website } = req.body;

    if (!req.body) {
        return res.status(400).json({ message: "Data tidak valid, silakan kirim ulang." });
    }

    try {
        const updatedCompany = await Company.findByIdAndUpdate(
            id, 
            { name, address, website }, 
            { new: true }  
        );

        if (!updatedCompany) {
            return res.status(404).json({ error: 'Company not found' });
        }

        res.json(updatedCompany);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteCompany = async (req, res) => {
    const { id } = req.params;

    try {
        const company = await Company.findByIdAndDelete(id);

        if (!company) {
            return res.status(404).json({ error: 'Company not found' });
        }

        res.json({ message: 'Company deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.searchCompanies = async (req, res) => {
    const { name } = req.query;

    try {
        const companies = await Company.find({
            ...(name && { 
                name: { 
                    $regex: name, 
                    $options: 'i'  
                } 
            })
        });

        res.json(companies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
