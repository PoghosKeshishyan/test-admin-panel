const { prisma } = require("../prisma/prisma-client");

const all = async (req, res) => {
    try {
        const header_content = await prisma.header_content.findMany();
        res.status(200).json(header_content);
    } catch {
        res.status(400).json({ message: "Failed to retrieve header content data" });
    }
};

const header_content = async (req, res) => {
    const { id } = req.params;

    try {
        const header_content = await prisma.header_content.findUnique({ where: { id } });

        if (!header_content) {
            res.status(404).json({ message: "Header content not found" });
        }

        res.status(200).json(header_content);
    } catch {
        res.status(400).json({ message: "Failed to retrieve header content data" });
    }
};

const add = async (req, res) => {
    const data = req.body;

    if (
        !data.logo ||
        !data.menubar_icon_url ||
        !data.languages_icon_url ||
        !data.languages
    ) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const header_content = await prisma.header_content.create({
            data: { ...data, authorId: req.user.id },
        });

        res.status(201).json(header_content);
    } catch (error) {
        res.status(500).json({ message: "Failed to add header content" });
    }
};

const remove = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.header_content.delete({ where: { id } });
        res.status(200).json({ message: "Header content deleted successfully" });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Header content not found' });
        }

        res.status(500).json({ message: "Failed to delete Header content" });
    }
};

const edit = async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    try {
        await prisma.header_content.update({ where: { id }, data });
        res.status(200).json({ message: "Header content updated successfully" });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Header content not found' });
        }

        res.status(500).json({ message: "Failed to update navbar" });
    }
};

module.exports = {
    all,
    header_content,
    add,
    remove,
    edit,
};