const { prisma } = require("../prisma/prisma-client");

const all = async (req, res) => {
    try {
        const slider_control = await prisma.slider_control.findMany();
        res.status(200).json(slider_control);
    } catch {
        res.status(400).json({ message: "Failed to retrieve slider control data" });
    }
};

const slider_control = async (req, res) => {
    const { id } = req.params;

    try {
        const slider_control = await prisma.slider_control.findUnique({ where: { id } });

        if (!slider_control) {
            res.status(404).json({ message: "Slider control not found" });
        }

        res.status(200).json(slider_control);
    } catch {
        res.status(400).json({ message: "Failed to retrieve slider control data" });
    }
};

const add = async (req, res) => {
    const data = req.body;

    if (!data.prev_btn_icon_url || !data.next_btn_icon_url) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const slider_control = await prisma.slider_control.create({
            data: { ...data, authorId: req.user.id },
        });

        res.status(201).json(slider_control);
    } catch (error) {
        res.status(500).json({ message: "Failed to add slider control" });
    }
};

const remove = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.slider_control.delete({ where: { id } });
        res.status(200).json({ message: "Slider control deleted successfully" });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Slider control not found' });
        }

        res.status(500).json({ message: "Failed to delete slider control" });
    }
};

const edit = async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    try {
        await prisma.slider_control.update({ where: { id }, data });
        res.status(200).json({ message: "Slider control updated successfully" });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Slider control not found' });
        }

        res.status(500).json({ message: "Failed to update slider control" });
    }
};

module.exports = {
    all,
    slider_control,
    add,
    remove,
    edit,
};