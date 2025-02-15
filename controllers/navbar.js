const { prisma } = require("../prisma/prisma-client");

const all = async (req, res) => {
    const lang = req.query.lang || '';

    try {
        const navbars = await prisma.navbar.findMany(lang && {
            where: { lang },
        });

        res.status(200).json(navbars);
    } catch {
        res.status(400).json({ message: "Failed to retrieve navbar data" });
    }
};

const navbar = async (req, res) => {
    const { id } = req.params;

    try {
        const navbar = await prisma.navbar.findUnique({ where: { id } });

        if (!navbar) {
            res.status(404).json({ message: "Navbar not found" });
        }
      
        res.status(200).json(navbar);
    } catch {
        res.status(400).json({ message: "Failed to retrieve navbar data" });
    }
};

const add = async (req, res) => {
    const data = req.body;

    if (!data.lang || !data.url || !data.title) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const navbar = await prisma.navbar.create({
            data: { ...data, authorId: req.user.id },
        });

        res.status(201).json(navbar);
    } catch (error) {
        res.status(500).json({ message: "Failed to add navbar" });
    }
};

const remove = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.navbar.delete({ where: { id } });
        res.status(200).json({ message: "Navbar deleted successfully" });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Navbar not found' });
        }

        res.status(500).json({ message: "Failed to delete navbar" });
    }
};

const edit = async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    try {
        await prisma.navbar.update({ where: { id }, data });
        res.status(200).json({ message: "Navbar updated successfully" });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Navbar not found' });
        }

        res.status(500).json({ message: "Failed to update navbar" });
    }
};

module.exports = {
    all,
    navbar,
    add,
    remove,
    edit,
};