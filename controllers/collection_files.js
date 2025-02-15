const { prisma } = require("../prisma/prisma-client");
const multiparty = require("multiparty");
const fs = require("fs");
const path = require("path");

const all = async (req, res) => {
    const folder = req.query.folder || '';

    try {
        const collection_files = await prisma.collection_files.findMany(folder && {
            where: { folder },
        });

        res.status(200).json(collection_files);
    } catch {
        res.status(400).json({ message: "Failed to retrieve collection files data" });
    }
};

const collection_file = async (req, res) => {
    const { id } = req.params;

    try {
        const collection_file = await prisma.collection_files.findUnique({
            where: { id },
        });

        if (!collection_file) {
            return res.status(404).json({ message: "File not found" });
        }

        res.status(200).json(collection_file);
    } catch (error) {
        res.status(400).json({ message: "Failed to retrieve collection file data" });
    }
};

const add = async (req, res) => {
    const file_upload_dir = "./public/images/";
    const form = new multiparty.Form();

    form.parse(req, async function (error, fields, files) {
        if (error) {
            return res.status(400).json({ message: "Failed to parse form data" });
        }

        const folder = fields.folder && fields.folder[0].toLowerCase();
        const uploadedFiles = files.file;

        if (!folder || !uploadedFiles || uploadedFiles.length === 0) {
            return res.status(400).json({ message: "All fields are required" });
        }

        try {
            const folder_name = path.join(file_upload_dir, folder);

            if (!fs.existsSync(folder_name)) {
                fs.mkdirSync(folder_name, { recursive: true });
            }

            const file_urls = [];

            for (let file of uploadedFiles) {
                const file_path = file.path;
                const file_name = file_path.slice(file_path.lastIndexOf("\\") + 1);
                const updated_file_name = `${folder}_${Date.now()}_${file_name}`;
                const file_full_path = path.join(folder_name, updated_file_name);
                const file_url = path.join("/images", folder, updated_file_name).replace(/\\/g, '/');

                await fs.promises.rename(file_path, file_full_path);
                file_urls.push(file_url);
            }

            const collection_files = await prisma.collection_files.createMany({
                data: file_urls.map(file_url => ({
                    folder,
                    file_url,
                    authorId: req.user.id,
                })),
            });

            res.status(201).json(collection_files);
        } catch (error) {
            return res.status(500).json({ message: "Failed to add files" });
        }
    });
};

const remove = async (req, res) => {
    const { id } = req.params;

    try {
        const collection_files = await prisma.collection_files.findUnique({
            where: { id },
            select: { file_url: true },
        });

        if (!collection_files) {
            return res.status(404).json({ message: 'File not found' });
        }

        await prisma.collection_files.delete({ where: { id } });

        const file_url = collection_files.file_url;

        if (file_url) {
            const filePath = path.join(__dirname, '..', 'public', file_url);
            await fs.promises.unlink(filePath);
        }

        res.status(200).json({ message: "File deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete file" });
    }
};

const edit = async (req, res) => {
    const file_upload_dir = "./public/images/";
    let form = new multiparty.Form();

    form.parse(req, async function (error, fields, files) {
        if (error) {
            return res.status(400).json({ message: "Failed to parse form data" });
        }

        if (!fields.folder || !files.file) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const data = fields;
        const { id } = req.params;
        const new_file = files.file && files.file[0];

        if (fields.folder && fields.folder[0]) {
            data.folder = fields.folder[0].toLowerCase();
        }

        try {
            const existing_file = await prisma.collection_files.findUnique({ where: { id } });

            if (!existing_file) {
                return res.status(404).json({ message: "File not found" });
            }

            let old_file_url = existing_file.file_url;
            let file_url = old_file_url;

            if (new_file) {
                const folder = data.folder;
                const folder_name = path.join(file_upload_dir, folder);

                if (!fs.existsSync(folder_name)) {
                    fs.mkdirSync(folder_name, { recursive: true });
                }

                let file_name = old_file_url ? path.basename(old_file_url) : new_file.originalFilename;
                const file_full_path = path.join(folder_name, file_name);
                file_url = path.join("/images", folder, file_name).replace(/\\/g, '/');

                fs.rename(new_file.path, file_full_path, (err) => {
                    if (err) {
                        return res.status(500).json({ message: "Failed to move the uploaded file" });
                    }
                });
            }

            data.file_url = file_url;
            await prisma.collection_files.update({ where: { id }, data });

            res.status(200).json({ message: "File updated successfully" });
        } catch (err) {
            res.status(500).json({ message: "Failed to update file" });
        }
    });
};

module.exports = {
    all,
    collection_file,
    add,
    remove,
    edit,
};