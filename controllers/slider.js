const { prisma } = require("../prisma/prisma-client");

const all = async (req, res) => {
    const lang = req.query.lang || '';

    try {
        const slider = await prisma.slider.findMany(lang && {
            where: { lang },
        });

        res.status(200).json(slider);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Failed to retrieve slider data" });
    }
};

const slider = async (req, res) => {
    const { id } = req.params;

    try {
        const slide = await prisma.slider.findUnique({ where: { id } });

        if (!slide) {
            return res.status(404).json({ message: "Slider not found" });
        }

        res.status(200).json(slide);
    } catch (error) {
        res.status(400).json({ message: "Failed to retrieve slide data" });
    }
};

const add = async (req, res) => {
    const data = req.body;

    if (
        !data.lang ||
        !data.title ||
        !data.vid_url ||
        !data.descr ||
        !data.btn_text ||
        !data.btn_url
    ) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const slider = await prisma.slider.create({
            data: { ...data, authorId: req.user.id },
        });

        res.status(201).json(slider);
    } catch (error) {
        res.status(500).json({ message: "Failed to create slider" });
    }
};

const remove = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.slider.delete({ where: { id } });
        res.status(200).json({ message: "Slide deleted successfully" });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Slide not found' });
        }

        res.status(500).json({ message: "Failed to delete slide" });
    }
};

const edit = async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    try {
        await prisma.slider.update({ where: { id }, data });
        res.status(200).json({ message: "Slide updated successfully" });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Slide not found' });
        }

        res.status(500).json({ message: "Failed to update slide" });
    }
};

module.exports = {
    all,
    slider,
    add,
    remove,
    edit,
};